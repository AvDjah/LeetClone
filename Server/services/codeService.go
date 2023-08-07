package services

import (
	"backend/helpers"
	"bytes"
	"log"
	"os/exec"
)

// Run MovieFilesToContainer.sh
func moveFilesToContainer() []byte {
	cmd := exec.Command("/bin/bash", "./Scripts/MoveFilesToContainer.sh")

	var out bytes.Buffer
	var stderr bytes.Buffer
	cmd.Stdout = &out
	cmd.Stderr = &stderr

	err := cmd.Run()
	helpers.Check(err)

	if out.String() == "Success" {
		return []byte("Success")
	}
	helpers.Printer("moveFilesToContainer: ", out.String())
	return []byte("Failure1")
}

func runFileInContainer() []byte {
	cmd := exec.Command("/bin/bash", "./Scripts/RunFileInContainer.sh")

	var out bytes.Buffer
	var stderr bytes.Buffer
	cmd.Stdout = &out
	cmd.Stderr = &stderr

	err := cmd.Run()
	helpers.Check(err)

	helpers.Printer("runFileInContainer: ", out.String())

	return out.Bytes()
}

func RunCommands() []byte {
	out1 := moveFilesToContainer()
	helpers.Printer("out1", string(out1))

	if string(out1) == "Failure" {
		log.Fatal("Failure Moving Files To Container")
	}

	out2 := runFileInContainer()
	helpers.Printer("out2", out2)

	return out2
}
