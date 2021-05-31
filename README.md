# microservices-mongo-qa
Ongoing of a QA strategy for testing microservices implemented using Node and MongoDB.


## For running the mongoDB container
> docker run --name mongo -d -p 27017:27017 mongo

* A good tool for acessing the DB using GUI is the Robot3T

## For running the RabbitMQ container
> docker run -d --hostname rabbitmq --name rabbitmq -p 15672:15672 -p 5672:5672 -p 25676:25676 rabbitmq:3-management

## For running CI Simulation
For specifying the local configurations:
`
docker network create --driver bridge skynet
docker run --name mongo --network=skynet -p 27017:27017 mongo
docker run -d --hostname rabbitmq --name rabbitmq --network=skynet -p 15672:15672 -p 5672:5672 -p 25676:25676 rabbitmq:3-management
`

You should add the containers IPs to the machine hosts:
`
127.0.0.1 mongo
127.0.0.1 rabbitmq
127.0.0.1 jenkins
`

## How the SUT works?

![Alt text](docs/about_application.png?raw=true "SUT_flow")