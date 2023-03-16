NAME=Transcendence

all: up

up:
	@printf "Building configuration ${NAME}...\n"
	sudo service docker restart 
	docker-compose up --build

down:
	@printf "Stopping configuration ${NAME}...\n"
	docker-compose down

clean:
	@printf "Cleaning configuration ${NAME}...\n"	
	docker-compose down \
	&& docker system prune -af

fclean: clean
	docker volume rm `docker volume ls -q`
	
re:	clean up

stop:
	docker stop `docker ps -aq`

list:
	docker ps

volumes: 
	docker volume ls

volumes_del:
	docker volume rm -f `docker volume ls -q`


.PHONY: up down clean fclean re stop list volumes volume_del