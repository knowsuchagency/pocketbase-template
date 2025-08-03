package routes

import (
	"github.com/getkin/kin-openapi/openapi3"
)

func GenerateOpenAPISpec() *openapi3.T {
	spec := &openapi3.T{
		OpenAPI: "3.0.3",
		Info: &openapi3.Info{
			Title:       "PocketBase Project API",
			Description: "Custom API endpoints for PocketBase Project application",
			Version:     "1.0.0",
		},
		// Servers will be set dynamically based on request
	}

	spec.Paths = openapi3.NewPaths()

	// Health endpoint
	spec.Paths.Set("/health", &openapi3.PathItem{
		Get: &openapi3.Operation{
			Tags:        []string{"Health"},
			Summary:     "Health Check",
			Description: "Check if the API is running",
			OperationID: "healthCheck",
			Responses: openapi3.NewResponses(openapi3.WithStatus(200, &openapi3.ResponseRef{
				Value: &openapi3.Response{
					Description: stringPtr("API is healthy"),
					Content: openapi3.Content{
						"text/plain": &openapi3.MediaType{
							Schema: &openapi3.SchemaRef{
								Value: &openapi3.Schema{
									Type:    &openapi3.Types{"string"},
									Example: "OK",
								},
							},
						},
					},
				},
			})),
		},
	})

	return spec
}

func stringPtr(s string) *string {
	return &s
}
