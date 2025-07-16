#!/bin/bash
cd /tmp/kavia/workspace/code-generation/real-time-tic-tac-toe-f7b8db0a/tic_tac_toe_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

