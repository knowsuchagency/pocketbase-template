package main

import (
	"log"
	"os"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"

	"github.com/pocketbase/pocketbase/plugins/migratecmd"

	_ "app/migrations"
)

func main() {
	app := pocketbase.New()

	// Configure SMTP settings
	app.OnBootstrap().BindFunc(func(e *core.BootstrapEvent) error {
		smtpUsername := os.Getenv("SMTP_USERNAME")
		smtpPassword := os.Getenv("SMTP_PASSWORD")

		if smtpUsername != "" && smtpPassword != "" {
			app.Settings().Meta.SenderName = "knowsuchagency"
			app.Settings().Meta.SenderAddress = "noreply@knowsuchagency.com"
			app.Settings().SMTP.Enabled = true
			app.Settings().SMTP.Host = "email-smtp.us-east-2.amazonaws.com"
			app.Settings().SMTP.Port = 587
			app.Settings().SMTP.Username = smtpUsername
			app.Settings().SMTP.Password = smtpPassword
			app.Settings().SMTP.AuthMethod = "PLAIN"
			app.Settings().SMTP.TLS = true

			log.Println("SMTP: ENABLED with Amazon SES")
		} else {
			log.Println("SMTP: DISABLED (missing SMTP_USERNAME or SMTP_PASSWORD environment variables)")
		}

		return e.Next()
	})

	devMode, _ := app.RootCmd.Flags().GetBool("dev")

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		// enable auto creation of migration files when making collection changes in the Dashboard
		// (use PocketBase's built-in --dev flag to enable it only during development)
		Automigrate: devMode,
		Dir:         "migrations",
	})

	if devMode {
		log.Println("Automigrate: ENABLED (development mode)")
	} else {
		log.Println("Automigrate: DISABLED (production mode)")
	}

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		se.Router.GET("/health", func(re *core.RequestEvent) error {
			return re.String(200, "OK")
		})

		// Serve static files from pb_public using PocketBase's built-in static helper
		publicPath := "frontend/build"

		// Check if pb_public directory exists
		if _, err := os.Stat(publicPath); os.IsNotExist(err) {
			log.Printf("Warning: Frontend public directory not found at %s", publicPath)
		} else {
			// Use PocketBase's apis.Static() to serve the entire pb_public directory
			// This will handle all static files including assets, favicon.ico, robots.txt, and SPA routing
			// The 'true' parameter enables index.html fallback for SPA routing
			se.Router.GET("/{path...}", apis.Static(os.DirFS(publicPath), true))
			log.Printf("Serving static files from %s", publicPath)
		}

		return se.Next()
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
