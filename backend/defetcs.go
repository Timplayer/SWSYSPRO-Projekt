package main

import (
	"image"
	"time"
)

type defect struct {
	Id          int64       `json:"id"`
	Name        string      `json:"name"`
	Date        time.Time   `json:"date"`
	Description string      `json:"description"`
	Pictures    image.Image `json:"pictures"`
}
