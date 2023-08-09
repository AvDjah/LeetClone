package helpers

import (
	"fmt"
	"log"
)

func Check(err error, at string) {
	if err != nil {

		log.Fatal(at+": ", err)
	}
}

func Printer(name string, a ...any) {
	fmt.Println(name+": ", a)
}
