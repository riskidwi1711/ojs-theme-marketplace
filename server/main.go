package main

import (
	"fmt"
	"os"
	"time"

	"ojs-server/cmd"
)

const banner = `
  ___________          .__          __                 
 /   _____/  | __ ____ |  |   _____/  |_  ____   ____  
 \_____  \|  |/ // __ \|  | _/ __ \   __\/  _ \ /    \ 
 /        \    <\  ___/|  |_\  ___/|  | (  <_> )   |  \
/_______  /__|_ \\___  >____/\___  >__|  \____/|___|  /
        \/     \/    \/          \/                 \/
`

func main() {
	if tz := os.Getenv("TZ"); tz != "" {
		var err error
		time.Local, err = time.LoadLocation(tz)
		if err != nil {
			fmt.Printf("error loading location '%s': %v\n", tz, err)
		} else {
			fmt.Printf("location loaded '%s'\n", tz)
		}
	}

	fmt.Print(banner)
	cmd.Run()
}
