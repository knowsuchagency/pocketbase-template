package main

import (
	"fmt"
	"log"
	"strings"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/spf13/cobra"
)

func main() {
	app := pocketbase.New()

	var showHidden bool

	showCollectionsCmd := &cobra.Command{
		Use:   "show-collections",
		Short: "Display all collections in a human-readable format",
		Run: func(cmd *cobra.Command, args []string) {
			// Bootstrap the app to load data
			app.Bootstrap()

			collections, err := app.FindAllCollections()
			if err != nil {
				log.Fatal(err)
			}

			// Filter collections based on show-hidden flag
			visibleCollections := []*core.Collection{}
			hiddenCount := 0
			for _, collection := range collections {
				if strings.HasPrefix(collection.Name, "_") {
					hiddenCount++
					if showHidden {
						visibleCollections = append(visibleCollections, collection)
					}
				} else {
					visibleCollections = append(visibleCollections, collection)
				}
			}

			if showHidden {
				fmt.Printf("=== PocketBase Collections (%d total, including %d hidden) ===\n\n", len(collections), hiddenCount)
			} else {
				fmt.Printf("=== PocketBase Collections (%d visible, %d hidden) ===\n\n", len(visibleCollections), hiddenCount)
			}

			for i, collection := range visibleCollections {
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
		},
	}

	showCollectionsCmd.Flags().BoolVar(&showHidden, "show-hidden", false, "Show hidden collections (those starting with underscore)")
	
	app.RootCmd.AddCommand(showCollectionsCmd)

	// Suppress default output
	app.RootCmd.SilenceUsage = true
	app.RootCmd.SilenceErrors = true

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}