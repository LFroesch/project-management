  # Claude Instructions

  ## Search Guidelines
  - NEVER search in: node_modules/, dist/, build/, .git/, coverage/
  - When using Grep/Glob, always exclude build directories
  - Use specific file paths instead of broad searches
  - Don't use Task tool for simple file searches - use Grep/Glob directly
  - Never use a tool without permission

  ## Task Agent Usage - CRITICAL
  - NEVER use Task/Plan agents for simple analysis or when file is already open
  - NEVER use Task agents when you can just Read the file directly
  - Task agents waste 20k+ tokens - only use for complex multi-file searches
  - If user has file open in IDE, just READ IT, don't use agents