
#!/bin/bash

# Check if vite is installed globally
if ! command -v vite &> /dev/null; then
    echo "Vite not found globally, using npx to run it..."
    npx vite
else
    echo "Using global vite installation..."
    vite
fi
