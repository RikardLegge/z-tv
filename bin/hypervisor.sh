#!/bin/bash
cd "$(dirname "$0")"

./run.sh &

while :
do
	sleep 10
	git pull
	if [[ "$?" -ne 0 ]]; then
    echo "Killing electron process"
    ps -ef | grep electron | grep -v grep | awk '{print $2;}' | xargs kill -9
    echo "Starting new process"
    ./run.sh &
  fi
done

