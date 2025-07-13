package routes

import (
	"github.com/pocketbase/pocketbase/core"
)

func Register(se *core.ServeEvent) error {
	// Register index route
	RegisterIndex(se)
	
	// Register health route
	RegisterHealth(se)

	return se.Next()
}
