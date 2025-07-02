package main

import (
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func main() {
	app := pocketbase.New()

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		collections, err := app.FindAllCollections()
		if err != nil {
			return err
		}

		fmt.Printf("=== PocketBase Collections (%d total) ===\n\n", len(collections))

		for i, collection := range collections {
			fmt.Printf("%d. %s (%s)\n", i+1, collection.Name, collection.Type)
			fmt.Printf("   ID: %s\n", collection.Id)
			
			if collection.System {
				fmt.Printf("   System: true\n")
			}
			
			// Display fields
			if len(collection.Fields) > 0 {
				fmt.Printf("   Fields (%d):\n", len(collection.Fields))
				for _, field := range collection.Fields {
					fmt.Printf("     - %s: %s\n", field.GetName(), field.Type())
				}
			}
			
			// Display indexes
			if len(collection.Indexes) > 0 {
				fmt.Printf("   Indexes:\n")
				for _, index := range collection.Indexes {
					fmt.Printf("     - %s\n", strings.TrimSpace(index))
				}
			}
			
			// Display rules
			rules := []string{}
			if collection.ListRule != nil && *collection.ListRule != "" {
				rules = append(rules, fmt.Sprintf("list: %s", *collection.ListRule))
			}
			if collection.ViewRule != nil && *collection.ViewRule != "" {
				rules = append(rules, fmt.Sprintf("view: %s", *collection.ViewRule))
			}
			if collection.CreateRule != nil && *collection.CreateRule != "" {
				rules = append(rules, fmt.Sprintf("create: %s", *collection.CreateRule))
			}
			if collection.UpdateRule != nil && *collection.UpdateRule != "" {
				rules = append(rules, fmt.Sprintf("update: %s", *collection.UpdateRule))
			}
			if collection.DeleteRule != nil && *collection.DeleteRule != "" {
				rules = append(rules, fmt.Sprintf("delete: %s", *collection.DeleteRule))
			}
			
			if len(rules) > 0 {
				fmt.Printf("   Rules:\n")
				for _, rule := range rules {
					fmt.Printf("     - %s\n", rule)
				}
			}
			
			fmt.Println()
		}
		
		// Exit after displaying
		os.Exit(0)
		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}