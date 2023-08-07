timeout -k 2 2 python3 main.py > directory.txt
if [ $? -eq 124 ]
then
  echo "Timeout exceeded!"
else
  cat directory.txt
fi