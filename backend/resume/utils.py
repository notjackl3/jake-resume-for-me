import subprocess
import os
import time
import uuid
import boto3
from django.conf import settings
from botocore.exceptions import NoCredentialsError


def escape_latex(text):
    """
    Escape special LaTeX characters in text
    """
    if not isinstance(text, str):
        text = str(text)
    
    # Dictionary of LaTeX special characters and their escaped versions
    latex_special_chars = {
        '&': r'\&',
        '%': r'\%',
        '$': r'\$',
        '#': r'\#',
        '^': r'\textasciicircum{}',
        '_': r'\_',
        '{': r'\{',
        '}': r'\}',
        '~': r'\textasciitilde{}',
    }
    
    # Replace special characters
    for char, escaped in latex_special_chars.items():
        text = text.replace(char, escaped)
    
    # Handle quotes (convert smart quotes to regular quotes)
    text = text.replace('"', '"').replace('"', '"')  # Smart double quotes
    text = text.replace(''', "'").replace(''', "'")  # Smart single quotes
    
    return text


def compile_latex_to_s3(bucket_name, latex_key, folder, output_folder="media-resume/output"):
    """
    Download LaTeX file from S3, compile to PDF, upload PDF back to S3
    """
    # Generate unique filename to avoid conflicts
    unique_id = str(uuid.uuid4())[:8]
    timestamp = int(time.time())
    
    # Create temporary filenames
    temp_latex_filename = f"temp_{unique_id}.tex"
    temp_latex_path = os.path.join(folder, temp_latex_filename)
    
    # Expected PDF filename (what pdflatex will generate)
    temp_pdf_filename = f"temp_{unique_id}.pdf"
    generated_pdf_path = os.path.join(folder, temp_pdf_filename)

    # Download LaTeX file from S3
    s3 = boto3.client(
        's3',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION_NAME
    )
    
    try:
        # Download LaTeX content from S3
        s3_object = s3.get_object(Bucket=bucket_name, Key=latex_key)
        latex_content = s3_object['Body'].read().decode('utf-8')
        
        # Write LaTeX content to temporary file
        with open(temp_latex_path, 'w', encoding='utf-8') as temp_file:
            temp_file.write(latex_content)

        # Run pdflatex to generate the PDF
        result = subprocess.run(
            ["pdflatex", "-interaction=nonstopmode", temp_latex_filename],
            cwd=folder,
            capture_output=True,
            text=True
        )
        
        # Check if pdflatex succeeded
        if result.returncode != 0:
            print(f"pdflatex failed with return code {result.returncode}")
            print(f"stderr: {result.stderr}")
            print(f"stdout: {result.stdout}")
            return None

        # Check if PDF was actually generated
        if not os.path.exists(generated_pdf_path):
            print(f"PDF file was not generated at {generated_pdf_path}")
            return None
        
        print("pdf is indeed generated")

        # Generate S3 key for the PDF
        original_filename = os.path.splitext(os.path.basename(latex_key))[0]
        pdf_s3_key = f"{output_folder}/{original_filename}-{timestamp}.pdf"

        # Upload PDF to S3
        with open(generated_pdf_path, 'rb') as pdf_file:
            s3.put_object(
                Body=pdf_file, 
                Bucket=bucket_name, 
                Key=pdf_s3_key,
                ContentType='application/pdf'
            )
            print("put object into s3")

        # Clean up temporary files
        cleanup_files = [
            temp_latex_path,
            generated_pdf_path,
            os.path.join(folder, f"temp_{unique_id}.aux"),
            os.path.join(folder, f"temp_{unique_id}.log"),
        ]
        
        for file_path in cleanup_files:
            if os.path.exists(file_path):
                os.remove(file_path)

        print(f"https://{bucket_name}.s3.amazonaws.com/{pdf_s3_key}")
        # Return the S3 URL for the PDF
        return f"https://{bucket_name}.s3.amazonaws.com/{pdf_s3_key}"

    except Exception as e:
        print(f"Error during PDF generation: {e}")
        # Clean up on error
        cleanup_files = [temp_latex_path, generated_pdf_path]
        for file_path in cleanup_files:
            if os.path.exists(file_path):
                try:
                    os.remove(file_path)
                except:
                    pass
        return None
    

def compile_experience_to_latex_direct(content, bucket_name, base_template_key="latex_templates/base_template.tex"):
    """
    Compile experience data directly to PDF without storing intermediate LaTeX in S3
    """
    folder_path = '/tmp'
    
    # Download base template from S3
    s3 = boto3.client(
        's3',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION_NAME
    )
    
    try:
        # Get base template
        s3_object = s3.get_object(Bucket=bucket_name, Key=base_template_key)
        base_template = s3_object['Body'].read().decode('utf-8')
        
        # Generate LaTeX content for experiences
        new_latex_content = ""
        for experience in content:
            # Extract and escape all text fields
            title = escape_latex(experience.get("title", ""))
            organisation = escape_latex(experience.get("organisation", ""))
            location = escape_latex(experience.get("location", ""))
            start_date = escape_latex(experience.get("start_date", ""))
            end_date = escape_latex(experience.get("end_date", ""))
            descriptions = experience.get("descriptions", [])
            
            desc_items = ""
            for desc in descriptions:
                # Handle both string and dict descriptions
                if isinstance(desc, dict):
                    desc_text = desc.get("content", "")
                else:
                    desc_text = desc
                
                escaped_desc = escape_latex(desc_text)
                desc_items += f"\\resumeItem{{{escaped_desc}}}\n            "

            new_latex_content += f"""
        \\resumeSubheading{{{title}}}{{{start_date}--{end_date}}}{{{organisation}}}{{{location}}}
        \\resumeItemListStart
            {desc_items}\\resumeItemListEnd

        """
        
        # Replace the placeholder in the template
        modified_latex = base_template.replace("% INSERT__EXPERIENCES", new_latex_content)
        
        # Generate unique temporary filename
        unique_id = str(uuid.uuid4())[:8]
        timestamp = int(time.time())
        temp_latex_filename = f"resume_{unique_id}.tex"
        temp_latex_path = os.path.join(folder_path, temp_latex_filename)
        
        # Write modified LaTeX to temporary file
        with open(temp_latex_path, 'w', encoding='utf-8') as temp_file:
            temp_file.write(modified_latex)
        
        # Compile to PDF
        temp_pdf_filename = f"resume_{unique_id}.pdf"
        generated_pdf_path = os.path.join(folder_path, temp_pdf_filename)
        
        result = subprocess.run(
            ["pdflatex", "-interaction=nonstopmode", temp_latex_filename],
            cwd=folder_path,
            capture_output=True,
            text=True
        )
        
        if result.returncode != 0 or not os.path.exists(generated_pdf_path):
            print(f"pdflatex compilation failed")
            print(f"Return code: {result.returncode}")
            print(f"stderr: {result.stderr}")
            print(f"stdout: {result.stdout}")
            return None
        
        # Upload PDF to S3
        pdf_s3_key = f"media-resume/output/resume-{timestamp}.pdf"
        with open(generated_pdf_path, 'rb') as pdf_file:
            s3.put_object(
                Body=pdf_file,
                Bucket=bucket_name,
                Key=pdf_s3_key,
                ContentType='application/pdf'
            )
        
        # Clean up temporary files
        cleanup_files = [
            temp_latex_path,
            generated_pdf_path,
            os.path.join(folder_path, f"resume_{unique_id}.aux"),
            os.path.join(folder_path, f"resume_{unique_id}.log"),
        ]
        
        for file_path in cleanup_files:
            if os.path.exists(file_path):
                os.remove(file_path)
        
        return f"https://{bucket_name}.s3.amazonaws.com/{pdf_s3_key}"
        
    except Exception as e:
        print(f"Error in compile_experience_to_latex_direct: {e}")
        return None


def compile_latex_block_to_file_s3(bucket_name, latex_key, updated_latex_key, data_latex):
    """
    Download LaTeX from S3, replace multiple markers, upload modified version back to S3
    """
    s3 = boto3.client(
        's3',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION_NAME
    )
    try:
        s3_object = s3.get_object(Bucket=bucket_name, Key=latex_key)
        content = s3_object['Body'].read().decode('utf-8')
        
        # Replace each marker with its corresponding LaTeX content
        modified_content = content
        for marker, latex in data_latex.items():
            if latex.strip():
                print("replacing:", latex)
                modified_content = modified_content.replace(marker, latex)
        
        # Upload the modified LaTeX file back to S3
        s3.put_object(
            Body=modified_content, 
            Bucket=bucket_name, 
            Key=updated_latex_key,
            ContentType='application/x-tex'
        )
        return True
        
    except NoCredentialsError:
        print("Credentials not available")
        return False
    except Exception as e:
        print(f"An error occurred: {e}")
        return False


def compile_data_to_latex(content, bucket_name):
    """
    Compile all resume sections to PDF - Fixed version with proper escaping
    """
    latex_key = "latex_templates/base_template.tex"
    updated_latex_key = "latex_templates/updated_template.tex"
    folder_path = '/tmp'

    # Generate experiences section
    new_experiences_latex = ""
    for experience in content["experiences"]:
        print("experience here", experience)
        if experience["included"]:
            title = escape_latex(experience.get("title", ""))
            organisation = escape_latex(experience.get("organisation", ""))
            location = escape_latex(experience.get("location", ""))
            start_date = escape_latex(experience.get("start_date", ""))
            end_date = escape_latex(experience.get("end_date", ""))
            descriptions = experience.get("descriptions", [])
            
            temp = ""
            for desc in descriptions:
                # Handle both string and dict descriptions
                if isinstance(desc, dict):
                    desc_content = desc.get("content", "")
                else:
                    desc_content = desc
                
                escaped_desc = escape_latex(desc_content)
                temp += f"\\resumeItem{{{escaped_desc}}}\n            "

            new_experiences_latex += f"""
            \\resumeSubheading{{{title}}}{{{start_date}--{end_date}}}{{{organisation}}}{{{location}}}
            \\resumeItemListStart
                {temp}\\resumeItemListEnd

            """
    if new_experiences_latex:
        new_experiences_latex = f"""
        \\resumeSubHeadingListStart
        {new_experiences_latex}
        \\resumeSubHeadingListEnd
        """

    # Generate education section
    new_education_latex = ""
    for education in content["education"]:
        school = escape_latex(education.get("school", ""))
        major = escape_latex(education.get("major", ""))
        location = escape_latex(education.get("location", ""))
        start_date = escape_latex(education.get("start_date", ""))
        end_date = escape_latex(education.get("end_date", ""))
        gpa = escape_latex(education.get("gpa", ""))

        new_education_latex += f"""
        \\resumeSubheading{{{school}}}{{{location}}}{{{major}}}{{{start_date}--{end_date}}}

        """

    # Generate projects section
    new_projects_latex = ""
    for project in content["projects"]:
        if project["included"]:
            name = escape_latex(project.get("name", ""))
            tools = escape_latex(project.get("tools", ""))
            source_code = project.get("source_code", "")  # URLs don't need escaping
            descriptions = project.get("descriptions", [])
            
            temp = ""
            for desc in descriptions:
                # Handle both string and dict descriptions
                if isinstance(desc, dict):
                    desc_content = desc.get("content", "")
                else:
                    desc_content = desc
                
                escaped_desc = escape_latex(desc_content)
                temp += f"\\resumeItem{{{escaped_desc}}}\n            "

            new_projects_latex += f"""
            \\resumeProjectHeading{{\\textbf{{{name}}} $|$ \\emph{{{tools}}}}}{{\\href{{{source_code}}}{{\\underline{{Source Code}}}}}}
            \\resumeItemListStart
                {temp}\\resumeItemListEnd
            
            """
    if new_projects_latex:
        new_projects_latex = f"""
        \\resumeSubHeadingListStart
        {new_projects_latex}
        \\resumeSubHeadingListEnd
        """
    
    temp = ""
    for skill in content["skills"]:
        temp += f"{skill["content"]}, "
    temp = temp[:-2]

    new_skills_latex = f"""
    \item{{{temp}}}
    
    """

    personal_info = content["personal_info"]
    personal_portfolio = personal_info.get("portfolio", "")
    personal_linkedin = personal_info.get("linkedin", "")
    personal_github = personal_info.get("github", "")

    new_personal_info_latex = f"""
    \\textbf{{\\Huge \\scshape {personal_info['name']}}} \\\\ \\vspace{{1pt}}
    \\small {personal_info['number']} $|$ \\href{{{personal_info['email']}}}{{\\underline{{{personal_info['email']}}}}} $|$
    """
    if personal_portfolio:
        new_personal_info_latex += f"\\href{{{personal_portfolio}}}{{\\underline{{Portfolio}}}} $|$ "
    else:
        new_personal_info_latex += f"\\href{{}}{{}}"
    if personal_linkedin:
        new_personal_info_latex += f"\\href{{{personal_linkedin}}}{{\\underline{{LinkedIn}}}} $|$ "
    else:
        new_personal_info_latex += f"\\href{{}}{{}}"
    if personal_github:
        new_personal_info_latex += f"\\href{{{personal_github}}}{{\\underline{{Github}}}}"
    else:
        new_personal_info_latex += f"\\href{{}}{{}}"



    # Prepare all LaTeX sections for replacement
    new_data_latex = {
        "% INSERT_PERSONAL_INFO": new_personal_info_latex,
        "% INSERT_EXPERIENCES": new_experiences_latex,
        "% INSERT_EDUCATION": new_education_latex,
        "% INSERT_PROJECTS": new_projects_latex,
        "% INSERT_SKILLS": new_skills_latex,
    }

    print("Generated LaTeX sections:")
    for key, value in new_data_latex.items():
        print(f"{key}: {len(value)} characters")
    
    # Replace the blocks in LaTeX template stored on S3
    if not compile_latex_block_to_file_s3(bucket_name, latex_key, updated_latex_key, new_data_latex):
        return None

    # Generate PDF from updated LaTeX file stored in S3 and upload to S3
    pdf_url = compile_latex_to_s3(bucket_name, updated_latex_key, folder_path)
    
    return pdf_url