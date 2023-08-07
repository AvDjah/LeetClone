# Move Timeout checked runner to container
docker cp ./Scripts/RunFileScript.sh Container:/

# Give the File permissions
docker exec Container chmod +x ./RunFileScript.sh

# Move Code file to container
docker cp ./Code/main.py Container:/


# Success
echo "Success"


# TODO: ADD A FAILURE ECHO IF ANY OF THE COMMANDS FAIL