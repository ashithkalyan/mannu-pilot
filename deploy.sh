#!/usr/bin/env bash
# Deploy Mannu to Cloud Run (Mumbai). Prereqs: gcloud auth, a project with billing, Secret Manager + Cloud Run + Firestore APIs enabled.
set -euo pipefail
PROJECT="${PROJECT:?set PROJECT}"; REGION="${REGION:-asia-south1}"
npm i --silent @google-cloud/firestore            # production store (Cloud Run disk is ephemeral)
printf '%s' "${GEMINI_API_KEY:?get a key from Google AI Studio}" | gcloud secrets create gemini-api-key --data-file=- --project "$PROJECT" 2>/dev/null || \
printf '%s' "$GEMINI_API_KEY" | gcloud secrets versions add gemini-api-key --data-file=- --project "$PROJECT"
gcloud run deploy mannu --source . --project "$PROJECT" --region "$REGION" --allow-unauthenticated \
  --set-secrets GEMINI_API_KEY=gemini-api-key:latest \
  --set-env-vars "USE_FIRESTORE=1,DEVICE_KEYS=${DEVICE_KEYS:?comma-separated device keys},ADMIN_KEY=${ADMIN_KEY:?admin key},GEMINI_MODEL=${GEMINI_MODEL:-gemini-flash-latest}" \
  --min-instances 0 --max-instances 10 --memory 512Mi
echo "Load the pilot dataset into BigQuery:"
echo "  curl -H 'x-admin-key: \$ADMIN_KEY' \$URL/api/export/outcomes.csv > outcomes.csv && bq load --autodetect --source_format=CSV mannu.outcomes outcomes.csv"
