# Paradox
A neat tool to run scripts on a Server from Remote Clients.
Paradox is written in NodeJS and shipped as standalone executables for Linux, [unfortunately ;)] Windows and MacOS.

### Install
No need to build from source code unless you absolutely want to.
Grab the latest version from the [GitHub Releases](https://github.com/anupam-git/paradox/releases).

### How it works
To run scripts on the server, you need to first add scripts.
```
./paradox add-script <name> <script>
```

The Clients need to authenticate to run scripts. To create user use the following command
```
./paradox add-user <username> <password>
```

Once the scripts and users are added, you can start the Paradox Server to listen to requests from Clients.
```
./paradox start-server <host> <port>
```

From Clients, use the `run-script` command to run scripts on the remote server
```
./paradox run-script -u <username> -p <password> <host> <port> <script-name>
```
This will invoke the script at Server and exit.

If you want to receive the output of the scriptm then invoke the `run-scrupt` command with the `-w, --wait-for-output` option
```
./paradox run-script -u <username> -p <password> <host> <port> <script-name>
```

# Want To Treat Me? :)
If you want to show some love, you can Treat Me via Paypal. :)

[![Treats Me via PayPal](https://cdn.rawgit.com/twolfson/paypal-github-button/1.0.0/dist/button.svg)](https://paypal.me/AnupamBasak)

# Documentation
```
Usage: paradox [options] [command]

Options:

  -v, --version                                     output the version number
  -h, --help                                        output usage information

Commands:

  start-server <host> <port>                        Start Paradox Server
  add-user <username> <password>                    Add User to Paradox Server
  remove-user <username>                            Remove User from Paradox Server
  add-script <name> <script>                        Register a Script for Paradox Server [Requires Restart]
  remove-script <name>                              Removes a Registered Script from Paradox Server [Requires Restart]
  list-scripts <host> <port>                        Show List of Available Remote Scripts
  run-script [options] <host> <port> <script-name>  Run Script on Remote Paradox Server
  reset-config                                      Resets the Paradox Server to initial state [Requires Restart]
```

## start-server
```
Usage: start-server [options] <host> <port>

Start Paradox Server

Options:

  -h, --help  output usage information
```

## add-user
```
Usage: add-user [options] <username> <password>

Add User to Paradox Server

Options:

  -h, --help  output usage information
```

## remove-user
```
Usage: remove-user [options] <username>

Remove User from Paradox Server

Options:

  -h, --help  output usage information
```

## add-script
```
Usage: add-script [options] <name> <script>

Register a Script for Paradox Server [Requires Restart]

Options:

  -h, --help  output usage information
```

## remove-script
```
Usage: remove-script [options] <name>

Removes a Registered Script from Paradox Server [Requires Restart]

Options:

  -h, --help  output usage information
```

## list-scripts
```
Usage: list-scripts [options] <host> <port>

Show List of Available Remote Scripts

Options:

  -h, --help  output usage information
```
## run-script
```
Usage: run-script [options] <host> <port> <script-name>

Run Script on Remote Paradox Server

Options:

  -w, --wait-for-output      [Optional] Waits for output of Script
  -u, --username <username>  [Required]
  -p, --password <password>  [Required]
  -h, --help                 output usage information
```

## reset-config
```
Usage: reset-config [options]

Resets the Paradox Server to initial state [Requires Restart]

Options:

  -h, --help  output usage information
```