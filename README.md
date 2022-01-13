# Project-Catwalk-SDC

This is the **back-end** system design of **Project-Catwalk**. In this project, microservice architecture is used. Therefore, there will be four different servers for each section. This repo is showing the server for **product's reviews**.

In this API server, serval endpoints are created to send the corresponding data to the clents' requests. PostgreSQL is served as the database, and the dump data are already imported into it. Both database and server will be deployed to AWS:EC2 instance with Load Balancer applied to allow more traffic.
