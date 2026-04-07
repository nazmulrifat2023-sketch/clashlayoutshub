#!/usr/bin/env bash
set -euo pipefail

API="http://localhost:8080/api/generate-pro-tips"
COMBOS=$(psql "$DATABASE_URL" -t -A -c \
  "SELECT townhall || '|' || base_type FROM bases WHERE pro_tips = '{}' GROUP BY townhall, base_type ORDER BY townhall, base_type;")

TOTAL=$(echo "$COMBOS" | grep -c '|' || true)
DONE=0
FAILED=0

echo "Found $TOTAL TH+type combos to generate tips for..."
echo ""

while IFS='|' read -r TH TYPE; do
  [[ -z "$TH" ]] && continue
  DONE=$((DONE+1))
  printf "[%d/%d] TH%s %s ... " "$DONE" "$TOTAL" "$TH" "$TYPE"

  RESPONSE=$(curl -s --max-time 30 -X POST "$API" \
    -H "Content-Type: application/json" \
    -d "{\"townhall\": $TH, \"base_type\": \"$TYPE\"}" 2>&1)

  if echo "$RESPONSE" | grep -q '"tips"'; then
    # Use node to convert JSON array to PostgreSQL array literal
    PG_ARRAY=$(echo "$RESPONSE" | node -e "
const chunks=[]; process.stdin.on('data',d=>chunks.push(d)); process.stdin.on('end',()=>{
  const data=JSON.parse(chunks.join(''));
  const tips=data.tips||[];
  const escaped=tips.map(t=>t.replace(/'/g,\"''\"));
  process.stdout.write(\"ARRAY['\" + escaped.join(\"','\") + \"']\");
});")
    COUNT=$(echo "$RESPONSE" | node -e "
const c=[]; process.stdin.on('data',d=>c.push(d)); process.stdin.on('end',()=>{
  const d=JSON.parse(c.join('')); process.stdout.write(String((d.tips||[]).length));
});")
    psql "$DATABASE_URL" -c \
      "UPDATE bases SET pro_tips = $PG_ARRAY WHERE townhall = $TH AND base_type = '$TYPE';" > /dev/null 2>&1
    echo "✅ $COUNT tips saved"
  else
    echo "❌ failed: $(echo "$RESPONSE" | head -c 120)"
    FAILED=$((FAILED+1))
  fi

  sleep 0.3
done <<< "$COMBOS"

echo ""
echo "============================="
echo "Completed: $((DONE-FAILED)) succeeded, $FAILED failed."
FILLED=$(psql "$DATABASE_URL" -t -A -c "SELECT COUNT(*) FROM bases WHERE array_length(pro_tips,1) > 0;")
echo "Bases with tips in DB: $FILLED"
