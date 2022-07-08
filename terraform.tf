
provider "google" {
  project     = "groovy-autumn-290918"
}

resource "google_cloud_run_service" "default" {
  name     = "cloudrun-backend"
  location = "us-central1"

  template {
    spec {
      containers {
        image = "us-central1-docker.pkg.dev/groovy-autumn-290918/app1-repo/cloudrun-back-1:tag1"
      }
    }
  }
}

data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

resource "google_cloud_run_service_iam_policy" "noauth" {
  location    = "us-central1"
  project     = "groovy-autumn-290918"
  service     = google_cloud_run_service.default.name

  policy_data = data.google_iam_policy.noauth.policy_data
}