# fastdl_server
A very basic, lightweight static file server used for handling FastDL content.

## Concept
The thought process behind cobbling together this in 24 hours; 

- A GitHub CI action (in my case, within a private repo) organizes and bz2's the repos content; such compressed content gets placed into an orphaned branch.
    - Such action also sends a POST request to a predetermined endpoint; in this case, this server.
- This FastDL server pulls that data (and hears about it from the aforementioned http request) and stores it in the `data/serving` folder. What results is a FastDL server that remains in sync with the content thats used on a server (or, atleast, the content in the servers repo).
    - The webserver also acts as a web-browsable static file host. Not sure how useful that'll be because everything is bz2 compressed, but whatever.
    - The server **also** has functionality to generate a resources.lua file with meta info at the top, such as date and repo commit.

It's pretty simple, but it should work well.

## Plans
In order of importance...
- [ ] making it functional
- [ ] resources.lua file generator (w/ meta info)
- [ ] making it look good
