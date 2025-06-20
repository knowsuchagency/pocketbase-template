package main

import (
	"log"
	"os"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"

	"github.com/pocketbase/pocketbase/plugins/migratecmd"

	_ "app/migrations"
)

func main() {
	app := pocketbase.New()

	isGoRun := os.Getenv("DEV_MODE") == "true"

	// Configure SMTP settings
	app.OnBootstrap().BindFunc(func(e *core.BootstrapEvent) error {
		smtpUsername := os.Getenv("SMTP_USERNAME")
		smtpPassword := os.Getenv("SMTP_PASSWORD")

		if smtpUsername != "" && smtpPassword != "" {
			app.Settings().Meta.SenderName = "Candified"
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

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		// enable auto creation of migration files when making collection changes in the Dashboard
		// (the isGoRun check is to enable it only during development)
		Automigrate: isGoRun,
		Dir:         "migrations",
	})

	if isGoRun {
		log.Println("Automigrate: ENABLED (development mode)")
	} else {
		log.Println("Automigrate: DISABLED (production mode)")
	}

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		se.Router.GET("/health", func(re *core.RequestEvent) error {
			return re.String(200, "OK")
		})

		return se.Next()
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
