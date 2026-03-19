compile:
	echo "Compiling for every OS and Platform"
	go env -w GOPRIVATE=gitlab.com/gobang
	go mod tidy
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o bin/app

startpostgre:
	ssh -L 5432:127.0.0.1:5432 dev@202.150.161.130 -o port=2202

build:
	docker build . -t skeleton:1.0.0

run:
	docker run -d -p 3000:3000 --add-host=host.docker.internal:host-gateway --name skeleton skeleton:1.0.0

stop:
	docker kill skeleton

up: build run

down:
	docker stop skeleton
	docker rm skeleton
	docker rmi skeleton:1.0.0

logs:
	docker logs skeleton

localrun:
	go run main.go -count=1

runclear:
	clear
	go run main.go -count=1

seed-themes:
	go run cmd/seed-themes/main.go

seed-promos:
	go run cmd/seed-promos/main.go

seed-categories:
	go run cmd/seed-categories/main.go

seed-sections:
	go run cmd/seed-sections/main.go

seed-banners:
	go run cmd/seed-banners/main.go

seed-articles:
	go run cmd/seed-articles/main.go