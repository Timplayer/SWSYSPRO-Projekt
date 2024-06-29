FROM golang:1.22 AS builder

WORKDIR /go/src/app

# pre-copy/cache go.mod for pre-downloading dependencies
# and only redownloading them in subsequent builds if they change
COPY go.mod go.sum ./
RUN go mod download && go mod verify

# build
COPY . .
RUN CGO_ENABLED=0 go build -o /go/bin/app

# minimal container to execute
FROM gcr.io/distroless/static-debian12
COPY --from=builder /go/bin/app /
EXPOSE 80
CMD ["/app"]
