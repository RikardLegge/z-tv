# Z-tv

## How to run

Start by making sure to have node.js installed on your computer, otherwise install it.

If your using a system which supports bash scripts you can just run the files in `bin`.
* `bin/exportReport.sh` exports the event log from firebase. The files are in CSV format so they can be opened in 
excel for further analysis.
* `bin/hypervisor.sh` starts the z-tv application and checks for update with regular intervals. It also restarts
the application if it crashes.
* `bin/run.sh` starts the z-tv application.

If your on windows, check out [Linux subsystem for windows](https://docs.microsoft.com/en-us/windows/wsl/install-win10).
