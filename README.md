# fastdl_server
Very basic, lightweight static file server used for handling FastDL content.

## Concept
The thought process behind cobbling together this in 24 hours; 

- A GitHub action (in my case, within a private repo) bz2's the repos content via a CI action; such compressed content gets placed into an orphaned branch.
    - Such action also sends a POST request to a predetermined endpoint.
- This FastDL server pulls that data and stores it in the data/serving folder.
    - Also acts as a web-browsable static file host.
    - **Also** generates a resources.lua file (including date and original repo commit).

What results is a FastDL server that remains in sync with the content thats used on a server. It's pretty simple, but it works well.
