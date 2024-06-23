package main

import "net/http"

type image struct {
	Id       int64     `json:"id"`
	FileName string    `json:"file_name"`
	File     http.File `json:"file"`
}
