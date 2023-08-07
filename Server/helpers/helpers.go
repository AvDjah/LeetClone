package helpers

import (
	"fmt"
	"log"
)

func Check(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func Printer(name string, a ...any) {
	fmt.Println(name+": ", a)
}
