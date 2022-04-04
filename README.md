# Heartland Retail GitHub Actions

This is a collection of various reusable GitHub actions for use in our private repos

## Usage

### publish-test-results

Publishes the JUnit test result file to DataDog

```yml
  - uses: springboard-retail/github-actions/publish-test-results
    with:
      name: heartland-retail-cool-new-test-suite
      junit_file_path: ./test-results.xml
      tags: env:ci,app:my-app
      datadog_api_token: ${{ secrets.DD_OPS_API_KEY }}
    if: always()
```
