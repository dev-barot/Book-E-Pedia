
import re

def check_tags(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Simple regex to find tags
    # This won't be perfect for complex JSX but should catch basic mismatches
    tag_pattern = re.compile(r'<(/?)([a-zA-Z0-9_-]+)(\s|/?>)')
    
    stack = []
    lines = content.split('\n')
    
    # We only care about tags inside the return statement
    start_index = content.find('return (')
    if start_index == -1:
        print("No return ( found")
        return
    
    content = content[start_index:]
    
    # Find all tags
    for i, line in enumerate(content.split('\n')):
        for match in tag_pattern.finditer(line):
            is_closing = match.group(1) == '/'
            tag_name = match.group(2)
            is_self_closing = match.group(0).endswith('/>') or tag_name in ['img', 'input', 'br', 'hr']
            
            if is_self_closing and not is_closing:
                continue
            
            if is_closing:
                if not stack:
                    print(f"Extra closing tag </{tag_name}> at return-line {i+1}")
                    continue
                top = stack.pop()
                if top != tag_name:
                    print(f"Mismatched tag: opened <{top}>, closed with </{tag_name}> at return-line {i+1}")
            else:
                stack.append(tag_name)
    
    if stack:
        print(f"Unclosed tags: {stack}")
    else:
        print("All tags inside return appear balanced!")

check_tags(r"c:\Users\kbs38\Desktop\Desktop Files\College\DA\SE\Book-E-Pedia\frontend\src\components\EmployeePanel\EmployeeManageProducts\EmployeeAddProducts.js")
