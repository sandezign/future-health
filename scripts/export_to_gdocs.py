#!/usr/bin/env python3
"""
Convert RESEARCH_AND_IDEATION_SYNTHESIS.md to:
1. An HTML document optimized for 1-click copy-paste into Google Docs.
2. A native .docx document that can be uploaded directly to Google Drive.
"""

import os
import re
import html
import zipfile
import xml.sax.saxutils as saxutils

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
MD_FILE = os.path.join(PROJECT_ROOT, "docs", "research", "RESEARCH_AND_IDEATION_SYNTHESIS.md")
HTML_OUT = os.path.join(PROJECT_ROOT, "docs", "research", "RESEARCH_AND_IDEATION_SYNTHESIS_FOR_GOOGLE_DOCS.html")
DOCX_OUT = os.path.join(PROJECT_ROOT, "docs", "research", "RESEARCH_AND_IDEATION_SYNTHESIS.docx")

def parse_markdown(md_text):
    lines = md_text.splitlines()
    blocks = []
    i = 0
    n = len(lines)

    while i < n:
        line = lines[i]
        stripped = line.strip()

        # Empty lines
        if not stripped:
            i += 1
            continue

        # Horizontal Rule
        if re.match(r'^(\-{3,}|\*{3,}|_{3,})$', stripped):
            blocks.append(('hr', ''))
            i += 1
            continue

        # Fenced code block or mermaid
        if stripped.startswith("```"):
            lang = stripped[3:].strip()
            code_lines = []
            i += 1
            while i < n and not lines[i].strip().startswith("```"):
                code_lines.append(lines[i])
                i += 1
            i += 1 # skip closing ```
            code_content = "\n".join(code_lines)
            if lang == "mermaid":
                blocks.append(('mermaid', code_content))
            else:
                blocks.append(('code', (lang, code_content)))
            continue

        # Headings
        if line.startswith("#"):
            match = re.match(r'^(#{1,6})\s+(.*)$', line)
            if match:
                level = len(match.group(1))
                text = match.group(2).strip()
                blocks.append(('heading', (level, text)))
                i += 1
                continue

        # Blockquote / Metadata callout
        if line.startswith(">"):
            quote_lines = []
            while i < n and (lines[i].startswith(">") or (lines[i].strip() and not lines[i].startswith("#") and not lines[i].startswith("|"))):
                q_line = lines[i]
                if q_line.startswith(">"):
                    q_line = q_line[1:].strip()
                quote_lines.append(q_line)
                i += 1
            blocks.append(('quote', "\n".join(quote_lines)))
            continue

        # Table
        if stripped.startswith("|") and stripped.endswith("|"):
            table_lines = []
            while i < n and lines[i].strip().startswith("|") and lines[i].strip().endswith("|"):
                table_lines.append(lines[i].strip())
                i += 1
            blocks.append(('table', table_lines))
            continue

        # Bullet list
        if re.match(r'^\s*[\*\-\+]\s+', line):
            list_items = []
            while i < n and re.match(r'^\s*[\*\-\+]\s+', lines[i]):
                item_text = re.sub(r'^\s*[\*\-\+]\s+', '', lines[i]).strip()
                list_items.append(item_text)
                i += 1
            blocks.append(('ul', list_items))
            continue

        # Numbered list
        if re.match(r'^\s*\d+\.\s+', line):
            list_items = []
            while i < n and re.match(r'^\s*\d+\.\s+', lines[i]):
                item_text = re.sub(r'^\s*\d+\.\s+', '', lines[i]).strip()
                list_items.append(item_text)
                i += 1
            blocks.append(('ol', list_items))
            continue

        # Paragraph
        para_lines = []
        while i < n and lines[i].strip() and not lines[i].startswith("#") and not lines[i].startswith(">") and not lines[i].strip().startswith("|") and not lines[i].strip().startswith("```") and not re.match(r'^\s*[\*\-\+]\s+', lines[i]) and not re.match(r'^\s*\d+\.\s+', lines[i]) and not re.match(r'^(\-{3,}|\*{3,}|_{3,})$', lines[i].strip()):
            para_lines.append(lines[i].strip())
            i += 1
        blocks.append(('para', " ".join(para_lines)))

    return blocks

def inline_md_to_html(text):
    # Escape basic HTML
    text = html.escape(text)
    # Bold + Italic ***text***
    text = re.sub(r'\*\*\*(.*?)\*\*\*', r'<strong><em>\1</em></strong>', text)
    # Bold **text**
    text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', text)
    # Italic *text*
    text = re.sub(r'\*(.*?)\*', r'<em>\1</em>', text)
    # Inline code `code`
    text = re.sub(r'`(.*?)`', r'<code style="background-color: #f1f5f9; padding: 2px 4px; border-radius: 4px; font-family: monospace; font-size: 90%;">\1</code>', text)
    # Links [text](url)
    text = re.sub(r'\[(.*?)\]\((.*?)\)', r'<a href="\2" style="color: #2563eb; text-decoration: underline;">\1</a>', text)
    # Math symbols \ge, \le, etc.
    text = text.replace(r'\ge', '≥').replace(r'\le', '≤').replace(r'\approx', '≈').replace(r'\pm', '±')
    text = re.sub(r'\$(.*?)\$', r'<em>\1</em>', text)
    return text

def generate_html(blocks):
    html_body = []
    
    for b_type, content in blocks:
        if b_type == 'heading':
            level, text = content
            tag = f"h{level}"
            formatted_text = inline_md_to_html(text)
            margin_top = "28px" if level <= 2 else "20px"
            border_bottom = "border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;" if level <= 2 else ""
            color = "#0f172a" if level <= 2 else "#1e293b"
            html_body.append(f'<{tag} style="color: {color}; margin-top: {margin_top}; margin-bottom: 12px; {border_bottom} font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Arial, sans-serif;">{formatted_text}</{tag}>')
            
        elif b_type == 'para':
            formatted_text = inline_md_to_html(content)
            html_body.append(f'<p style="font-size: 11pt; line-height: 1.6; color: #334155; margin-bottom: 12px; font-family: Arial, sans-serif;">{formatted_text}</p>')
            
        elif b_type == 'quote':
            formatted_text = inline_md_to_html(content).replace("\n", "<br/>")
            html_body.append(f'<div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 12px 16px; margin: 16px 0; border-radius: 0 6px 6px 0; color: #1e293b; font-size: 10.5pt; line-height: 1.5; font-family: Arial, sans-serif;">{formatted_text}</div>')
            
        elif b_type == 'hr':
            html_body.append('<hr style="border: 0; height: 1px; background: #cbd5e1; margin: 24px 0;" />')
            
        elif b_type == 'ul':
            items = []
            for item in content:
                items.append(f'<li style="margin-bottom: 6px; font-size: 11pt; line-height: 1.5; color: #334155;">{inline_md_to_html(item)}</li>')
            html_body.append(f'<ul style="margin: 12px 0 16px 24px; padding-left: 0; font-family: Arial, sans-serif;">{"".join(items)}</ul>')
            
        elif b_type == 'ol':
            items = []
            for item in content:
                items.append(f'<li style="margin-bottom: 6px; font-size: 11pt; line-height: 1.5; color: #334155;">{inline_md_to_html(item)}</li>')
            html_body.append(f'<ol style="margin: 12px 0 16px 24px; padding-left: 0; font-family: Arial, sans-serif;">{"".join(items)}</ol>')
            
        elif b_type == 'table':
            table_lines = content
            if len(table_lines) >= 2:
                headers = [c.strip() for c in table_lines[0].strip('|').split('|')]
                # line 1 is separator |:---|:---|
                rows = []
                for row_line in table_lines[2:]:
                    cells = [c.strip() for c in row_line.strip('|').split('|')]
                    rows.append(cells)
                
                table_html = ['<table style="border-collapse: collapse; width: 100%; margin: 16px 0; font-size: 10pt; font-family: Arial, sans-serif; border: 1px solid #cbd5e1;">']
                # Header
                table_html.append('<thead><tr style="background-color: #f1f5f9;">')
                for h in headers:
                    table_html.append(f'<th style="border: 1px solid #cbd5e1; padding: 10px 12px; text-align: left; font-weight: 600; color: #0f172a;">{inline_md_to_html(h)}</th>')
                table_html.append('</tr></thead><tbody>')
                
                # Rows
                for row_idx, r in enumerate(rows):
                    bg = '#ffffff' if row_idx % 2 == 0 else '#f8fafc'
                    table_html.append(f'<tr style="background-color: {bg};">')
                    for cell in r:
                        table_html.append(f'<td style="border: 1px solid #cbd5e1; padding: 8px 12px; color: #334155; vertical-align: top;">{inline_md_to_html(cell)}</td>')
                    table_html.append('</tr>')
                table_html.append('</tbody></table>')
                html_body.append("".join(table_html))
                
        elif b_type == 'code':
            lang, code_text = content
            escaped = html.escape(code_text)
            html_body.append(f'<pre style="background-color: #0f172a; color: #f8fafc; padding: 16px; border-radius: 6px; overflow-x: auto; font-family: \'Consolas\', \'Courier New\', monospace; font-size: 9pt; line-height: 1.4;"><code>{escaped}</code></pre>')
            
        elif b_type == 'mermaid':
            escaped_code = html.escape(content)
            html_body.append(f'''
            <div style="margin: 20px 0; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; background-color: #ffffff;">
                <div style="font-size: 9pt; font-weight: bold; color: #64748b; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Mermaid Visual Architecture Diagram</div>
                <div class="mermaid">{content}</div>
                <details style="margin-top: 12px; font-size: 8.5pt; color: #64748b;">
                    <summary style="cursor: pointer;">Show Diagram Source Code</summary>
                    <pre style="background: #f8fafc; padding: 8px; border-radius: 4px; overflow-x: auto;"><code>{escaped_code}</code></pre>
                </details>
            </div>
            ''')

    full_html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Population Health Research & Strategic Ideation Synthesis</title>
    <!-- Mermaid JS for Visual Diagram Rendering -->
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
    <script>
        document.addEventListener("DOMContentLoaded", function() {{
            mermaid.initialize({{ startOnLoad: true, theme: 'neutral' }});
        }});
    </script>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f1f5f9;
            color: #1e293b;
        }}
        .top-banner {{
            position: sticky;
            top: 0;
            z-index: 999;
            background: #ffffff;
            border-bottom: 1px solid #cbd5e1;
            padding: 12px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }}
        .banner-title {{
            font-weight: bold;
            font-size: 14px;
            color: #0f172a;
        }}
        .btn-group {{
            display: flex;
            gap: 12px;
        }}
        .btn {{
            display: inline-flex;
            align-items: center;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 600;
            text-decoration: none;
            cursor: pointer;
            border: none;
            transition: all 0.2s;
        }}
        .btn-primary {{
            background-color: #2563eb;
            color: #ffffff;
        }}
        .btn-primary:hover {{
            background-color: #1d4ed8;
        }}
        .btn-secondary {{
            background-color: #f8fafc;
            color: #334155;
            border: 1px solid #cbd5e1;
        }}
        .btn-secondary:hover {{
            background-color: #f1f5f9;
        }}
        .content-card {{
            max-width: 900px;
            margin: 32px auto;
            background-color: #ffffff;
            padding: 48px 64px;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
        }}
        #copyFeedback {{
            display: none;
            color: #16a34a;
            font-weight: 600;
            font-size: 13px;
            margin-right: 8px;
        }}
    </style>
</head>
<body>

    <div class="top-banner">
        <div>
            <span class="banner-title">Google Docs Export Companion</span>
            <span style="font-size: 12px; color: #64748b; margin-left: 12px;">Formatted for 100% native fidelity in Google Docs</span>
        </div>
        <div class="btn-group">
            <span id="copyFeedback">✓ Copied Formatted Content!</span>
            <button class="btn btn-primary" onclick="copyForGDocs()">📋 Copy Entire Document for Google Docs</button>
            <a href="https://docs.new" target="_blank" class="btn btn-secondary">🚀 Open Google Docs (docs.new)</a>
        </div>
    </div>

    <div class="content-card" id="documentContent">
        {"".join(html_body)}
    </div>

    <script>
        function copyForGDocs() {{
            const content = document.getElementById('documentContent');
            const htmlData = content.innerHTML;
            const textData = content.innerText;
            
            if (navigator.clipboard && window.ClipboardItem) {{
                const blobHtml = new Blob([htmlData], {{ type: 'text/html' }});
                const blobText = new Blob([textData], {{ type: 'text/plain' }});
                const item = new ClipboardItem({{
                    'text/html': blobHtml,
                    'text/plain': blobText
                }});
                navigator.clipboard.write([item]).then(() => {{
                    showFeedback();
                }}).catch(err => {{
                    fallbackCopy(content);
                }});
            }} else {{
                fallbackCopy(content);
            }}
        }}

        function fallbackCopy(element) {{
            const range = document.createRange();
            range.selectNodeContents(element);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand('copy');
            selection.removeAllRanges();
            showFeedback();
        }}

        function showFeedback() {{
            const fb = document.getElementById('copyFeedback');
            fb.style.display = 'inline';
            setTimeout(() => {{
                fb.style.display = 'none';
            }}, 3500);
        }}
    </script>
</body>
</html>
'''
    return full_html

def generate_docx(blocks, docx_path):
    """
    Creates a clean, valid .docx file using standard library zipfile and XML.
    """
    w_ns = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
    
    # 1. Content_Types.xml
    content_types_xml = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>'''

    # 2. _rels/.rels
    package_rels_xml = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>'''

    # 3. word/_rels/document.xml.rels
    doc_rels_xml = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>'''

    # 4. word/styles.xml
    styles_xml = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
        <w:sz w:val="22"/>
        <w:color w:val="333333"/>
      </w:rPr>
    </w:rPrDefault>
  </w:docDefaults>
  <w:style w:type="paragraph" w:styleId="Normal" w:default="1">
    <w:name w:val="Normal"/>
    <w:pPr>
      <w:spacing w:after="160" w:line="276" w:lineRule="auto"/>
    </w:pPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/>
    <w:pPr>
      <w:spacing w:before="360" w:after="160"/>
    </w:pPr>
    <w:rPr>
      <w:b/>
      <w:color w:val="0F172A"/>
      <w:sz w:val="36"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="heading 2"/>
    <w:pPr>
      <w:spacing w:before="280" w:after="120"/>
    </w:pPr>
    <w:rPr>
      <w:b/>
      <w:color w:val="1E293B"/>
      <w:sz w:val="28"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading3">
    <w:name w:val="heading 3"/>
    <w:pPr>
      <w:spacing w:before="200" w:after="100"/>
    </w:pPr>
    <w:rPr>
      <w:b/>
      <w:color w:val="2563EB"/>
      <w:sz w:val="24"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Quote">
    <w:name w:val="Quote"/>
    <w:pPr>
      <w:pBdr>
        <w:left w:val="single" w:sz="24" w:space="15" w:color="2563EB"/>
      </w:pBdr>
      <w:ind w:left="360"/>
      <w:spacing w:before="140" w:after="140"/>
    </w:pPr>
    <w:rPr>
      <w:i/>
      <w:color w:val="475569"/>
    </w:rPr>
  </w:style>
</w:styles>'''

    # Helper function to convert markdown text into w:r runs
    def text_to_runs(text):
        # Clean text
        text = text.replace(r'\ge', '≥').replace(r'\le', '≤').replace(r'\approx', '≈')
        runs = []
        # Parse tokens
        token_pattern = re.compile(r'(\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*.*?\*|`.*?`|\$.*?\$|\[.*?\]\(.*?\))')
        pos = 0
        for m in token_pattern.finditer(text):
            if m.start() > pos:
                plain = text[pos:m.start()]
                runs.append(f'<w:r><w:t xml:space="preserve">{saxutils.escape(plain)}</w:t></w:r>')
            token = m.group(0)
            if token.startswith('***') and token.endswith('***'):
                inner = token[3:-3]
                runs.append(f'<w:r><w:rPr><w:b/><w:i/></w:rPr><w:t xml:space="preserve">{saxutils.escape(inner)}</w:t></w:r>')
            elif token.startswith('**') and token.endswith('**'):
                inner = token[2:-2]
                runs.append(f'<w:r><w:rPr><w:b/></w:rPr><w:t xml:space="preserve">{saxutils.escape(inner)}</w:t></w:r>')
            elif token.startswith('*') and token.endswith('*'):
                inner = token[1:-1]
                runs.append(f'<w:r><w:rPr><w:i/></w:rPr><w:t xml:space="preserve">{saxutils.escape(inner)}</w:t></w:r>')
            elif token.startswith('`') and token.endswith('`'):
                inner = token[1:-1]
                runs.append(f'<w:r><w:rPr><w:rFonts w:ascii="Consolas" w:hAnsi="Consolas"/><w:color w:val="B91C1C"/></w:rPr><w:t xml:space="preserve">{saxutils.escape(inner)}</w:t></w:r>')
            elif token.startswith('$') and token.endswith('$'):
                inner = token[1:-1]
                runs.append(f'<w:r><w:rPr><w:i/></w:rPr><w:t xml:space="preserve">{saxutils.escape(inner)}</w:t></w:r>')
            elif token.startswith('['):
                link_m = re.match(r'\[(.*?)\]\((.*?)\)', token)
                if link_m:
                    label = link_m.group(1)
                    runs.append(f'<w:r><w:rPr><w:color w:val="2563EB"/><w:u w:val="single"/></w:rPr><w:t xml:space="preserve">{saxutils.escape(label)}</w:t></w:r>')
                else:
                    runs.append(f'<w:r><w:t xml:space="preserve">{saxutils.escape(token)}</w:t></w:r>')
            pos = m.end()
        if pos < len(text):
            plain = text[pos:]
            runs.append(f'<w:r><w:t xml:space="preserve">{saxutils.escape(plain)}</w:t></w:r>')
        return "".join(runs)

    # 5. Build word/document.xml
    doc_body = []
    
    for b_type, content in blocks:
        if b_type == 'heading':
            level, h_text = content
            style_id = f"Heading{min(level, 3)}"
            runs = text_to_runs(h_text)
            doc_body.append(f'<w:p><w:pPr><w:pStyle w:val="{style_id}"/></w:pPr>{runs}</w:p>')
            
        elif b_type == 'para':
            runs = text_to_runs(content)
            doc_body.append(f'<w:p><w:pPr><w:pStyle w:val="Normal"/></w:pPr>{runs}</w:p>')
            
        elif b_type == 'quote':
            runs = text_to_runs(content.replace("\n", " "))
            doc_body.append(f'<w:p><w:pPr><w:pStyle w:val="Quote"/></w:pPr>{runs}</w:p>')
            
        elif b_type == 'hr':
            doc_body.append('<w:p><w:pPr><w:pBdr><w:bottom w:val="single" w:sz="8" w:space="8" w:color="CBD5E1"/></w:pBdr></w:pPr></w:p>')
            
        elif b_type == 'ul':
            for item in content:
                runs = text_to_runs(item)
                doc_body.append(f'<w:p><w:pPr><w:ind w:left="400"/><w:rPr></w:rPr></w:pPr><w:r><w:t xml:space="preserve">• </w:t></w:r>{runs}</w:p>')
                
        elif b_type == 'ol':
            for idx, item in enumerate(content, 1):
                runs = text_to_runs(item)
                doc_body.append(f'<w:p><w:pPr><w:ind w:left="400"/></w:pPr><w:r><w:t xml:space="preserve">{idx}. </w:t></w:r>{runs}</w:p>')
                
        elif b_type == 'table':
            table_lines = content
            if len(table_lines) >= 2:
                headers = [c.strip() for c in table_lines[0].strip('|').split('|')]
                rows = []
                for row_line in table_lines[2:]:
                    cells = [c.strip() for c in row_line.strip('|').split('|')]
                    rows.append(cells)
                
                tbl_xml = ['<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/><w:tblBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/><w:left w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/><w:right w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/><w:insideV w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/></w:tblBorders></w:tblPr>']
                
                # Header row
                tbl_xml.append('<w:tr><w:trPr><w:tblHeader/></w:trPr>')
                for h in headers:
                    runs = text_to_runs(h)
                    tbl_xml.append(f'<w:tc><w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="F1F5F9"/></w:tcPr><w:p><w:pPr><w:spacing w:after="60"/></w:pPr>{runs}</w:p></w:tc>')
                tbl_xml.append('</w:tr>')
                
                # Data rows
                for r_idx, r in enumerate(rows):
                    fill = "FFFFFF" if r_idx % 2 == 0 else "F8FAFC"
                    tbl_xml.append('<w:tr>')
                    for cell in r:
                        runs = text_to_runs(cell)
                        tbl_xml.append(f'<w:tc><w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="{fill}"/></w:tcPr><w:p><w:pPr><w:spacing w:after="40"/></w:pPr>{runs}</w:p></w:tc>')
                    tbl_xml.append('</w:tr>')
                    
                tbl_xml.append('</w:tbl>')
                doc_body.append("".join(tbl_xml))
                doc_body.append('<w:p><w:pPr><w:spacing w:after="120"/></w:pPr></w:p>')

        elif b_type == 'code' or b_type == 'mermaid':
            title = "Code / Diagram Architecture" if b_type == 'code' else "Mermaid Architecture Diagram"
            raw_text = content[1] if b_type == 'code' else content
            escaped_runs = saxutils.escape(raw_text).replace("\n", '<w:br/>')
            doc_body.append(f'<w:p><w:pPr><w:pBdr><w:left w:val="single" w:sz="16" w:color="94A3B8"/></w:pBdr><w:shd w:val="clear" w:color="auto" w:fill="F8FAFC"/><w:ind w:left="200"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="18"/><w:color w:val="64748B"/></w:rPr><w:t>{title}:</w:t></w:r><w:p><w:r><w:rPr><w:rFonts w:ascii="Consolas" w:hAnsi="Consolas"/><w:sz w:val="18"/><w:color w:val="1E293B"/></w:rPr><w:t xml:space="preserve">{escaped_runs}</w:t></w:r></w:p></w:p>')

    document_xml = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    {"".join(doc_body)}
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
    </w:sectPr>
  </w:body>
</w:document>'''

    with zipfile.ZipFile(docx_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        zf.writestr('[Content_Types].xml', content_types_xml)
        zf.writestr('_rels/.rels', package_rels_xml)
        zf.writestr('word/_rels/document.xml.rels', doc_rels_xml)
        zf.writestr('word/styles.xml', styles_xml)
        zf.writestr('word/document.xml', document_xml)

def main():
    print(f"Reading: {MD_FILE}")
    with open(MD_FILE, 'r', encoding='utf-8') as f:
        md_text = f.read()

    blocks = parse_markdown(md_text)
    print(f"Parsed {len(blocks)} document blocks.")

    # 1. Generate HTML
    html_content = generate_html(blocks)
    with open(HTML_OUT, 'w', encoding='utf-8') as f:
        f.write(html_content)
    print(f"✓ Generated HTML companion: {HTML_OUT}")

    # 2. Generate DOCX
    generate_docx(blocks, DOCX_OUT)
    print(f"✓ Generated native DOCX file: {DOCX_OUT}")

if __name__ == '__main__':
    main()
