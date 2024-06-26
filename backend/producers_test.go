package main

import (
	"bytes"
	"crypto/tls"
	"encoding/json"
	"io"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func createInsecureClient() *http.Client {
	tr := &http.Transport{
		TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	}
	client := &http.Client{Transport: tr}
	return client
}

func TestPostProducer(t *testing.T) {
	c := createInsecureClient()
	var p producer
	var result producer
	p.Name = "Producer Test"

	body, err := json.Marshal(p)
	if err != nil {
		t.Error(err)
	}

	post, err := c.Post("https://localhost:8080/api/producers", "application/json", bytes.NewBuffer(body))
	if err != nil {
		t.Error(err)
		return
	}
	output, err := io.ReadAll(post.Body)
	if err != nil {
		t.Error(err)
	}
	err = json.Unmarshal(output, &result)
	if err != nil {
		t.Error(err)
	}
	assert.Equal(t, p, result, "Post producer produced an unexpected result")
}
