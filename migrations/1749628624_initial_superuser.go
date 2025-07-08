package migrations

import (
	"os"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		// Create superuser record
		superusers, err := app.FindCollectionByNameOrId(core.CollectionNameSuperusers)
		if err != nil {
			return err
		}

		superuserRecord := core.NewRecord(superusers)
		superuserRecord.Set("email", os.Getenv("SUPERUSER_EMAIL"))
		superuserRecord.Set("password", os.Getenv("SUPERUSER_PASSWORD"))
		superuserRecord.Set("passwordConfirm", os.Getenv("SUPERUSER_PASSWORD"))

		if err := app.Save(superuserRecord); err != nil {
			return err
		}

		// Create regular user record
		users, err := app.FindCollectionByNameOrId("users")
		if err != nil {
			return err
		}

		userRecord := core.NewRecord(users)
		userRecord.Set("email", os.Getenv("SUPERUSER_EMAIL"))
		userRecord.Set("password", os.Getenv("SUPERUSER_PASSWORD"))
		userRecord.Set("passwordConfirm", os.Getenv("SUPERUSER_PASSWORD"))

		return app.Save(userRecord)
	}, func(app core.App) error { // optional revert operation
		// Delete superuser record
		superuserRecord, _ := app.FindAuthRecordByEmail(core.CollectionNameSuperusers, os.Getenv("SUPERUSER_EMAIL"))
		if superuserRecord != nil {
			if err := app.Delete(superuserRecord); err != nil {
				return err
			}
		}

		// Delete regular user record
		userRecord, _ := app.FindAuthRecordByEmail("users", os.Getenv("SUPERUSER_EMAIL"))
		if userRecord != nil {
			if err := app.Delete(userRecord); err != nil {
				return err
			}
		}

		return nil
	})
}
