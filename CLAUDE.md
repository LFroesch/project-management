  # Claude Instructions

  ## Search Guidelines
  - NEVER search in: node_modules/, dist/, build/, .git/, coverage/
  - When using Grep/Glob, always exclude build directories
  - Use specific file paths instead of broad searches
  - Don't use Task tool for simple file searches - use Grep/Glob directly
  - Never use a tool without permission