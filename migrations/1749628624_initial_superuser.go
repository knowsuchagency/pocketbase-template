package migrations

import (
	"os"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		// Skip superuser creation if credentials not provided
		email := os.Getenv("SUPERUSER_EMAIL")
		password := os.Getenv("SUPERUSER_PASSWORD")

		if email == "" || password == "" {
			app.Logger().Info("Skipping superuser creation - SUPERUSER_EMAIL or SUPERUSER_PASSWORD not set")
			return nil
		}

		// Create superuser record
		superusers, err := app.FindCollectionByNameOrId(core.CollectionNameSuperusers)
		if err != nil {
			return err
		}

		superuserRecord := core.NewRecord(superusers)
		superuserRecord.Set("email", email)
		superuserRecord.Set("password", password)
		superuserRecord.Set("passwordConfirm", password)

		if err := app.Save(superuserRecord); err != nil {
			return err
		}

		// Create regular user record
		users, err := app.FindCollectionByNameOrId("users")
		if err != nil {
			return err
		}

		userRecord := core.NewRecord(users)
		userRecord.Set("email", email)
		userRecord.Set("password", password)
		userRecord.Set("passwordConfirm", password)

		return app.Save(userRecord)
	}, func(app core.App) error { // optional revert operation
		// Skip if credentials not provided (nothing was created)
		email := os.Getenv("SUPERUSER_EMAIL")
		if email == "" {
			return nil
		}

		// Delete superuser record
		superuserRecord, _ := app.FindAuthRecordByEmail(core.CollectionNameSuperusers, email)
		if superuserRecord != nil {
			if err := app.Delete(superuserRecord); err != nil {
				return err
			}
		}

		// Delete regular user record
		userRecord, _ := app.FindAuthRecordByEmail("users", email)
		if userRecord != nil {
			if err := app.Delete(userRecord); err != nil {
				return err
			}
		}

		return nil
	})
}
