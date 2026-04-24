
def check_brackets(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    stack = []
    brackets = {'(': ')', '{': '}', '[': ']'}
    lines = content.split('\n')
    
    for i, line in enumerate(lines):
        for j, char in enumerate(line):
            if char in brackets.keys():
                stack.append((char, i+1, j+1))
            elif char in brackets.values():
                if not stack:
                    print(f"Extra closing bracket '{char}' at line {i+1}, col {j+1}")
                    return
                top, line_num, col_num = stack.pop()
                if brackets[top] != char:
                    print(f"Mismatched bracket: opened '{top}' at line {line_num}, col {col_num}, closed with '{char}' at line {i+1}, col {j+1}")
                    return
    
    if stack:
        for char, line_num, col_num in stack:
            print(f"Unclosed bracket '{char}' opened at line {line_num}, col {col_num}")
    else:
        print("All brackets are balanced!")

check_brackets(r"c:\Users\kbs38\Desktop\Desktop Files\College\DA\SE\Book-E-Pedia\frontend\src\components\EmployeePanel\EmployeeManageProducts\EmployeeAddProducts.js")
