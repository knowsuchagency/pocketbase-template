package migrations

import (
	"os"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
    m.Register(func(app core.App) error {
        superusers, err := app.FindCollectionByNameOrId(core.CollectionNameSuperusers)
        if err != nil {
            return err
        }

        record := core.NewRecord(superusers)

        record.Set("email", os.Getenv("SUPERUSER_EMAIL"))
        record.Set("password", os.Getenv("SUPERUSER_PASSWORD"))
        record.Set("passwordConfirm", os.Getenv("SUPERUSER_PASSWORD"))

        return app.Save(record)
    }, func(app core.App) error { // optional revert operation
        record, _ := app.FindAuthRecordByEmail(core.CollectionNameSuperusers, os.Getenv("SUPERUSER_EMAIL"))
        if record == nil {
            return nil // probably already deleted
        }

        return app.Delete(record)
    })
}
