// Fake AcmePay gateway client. Like lib/db's query helper, it simulates the
// outbound call with jittered latency, as if a real HTTP request were made.
export async function issueRefund({
  chargeId,
  amount,
  currencyCode,
}: {
  chargeId: string;
  amount: string;
  currencyCode: string;
}): Promise<{ refundId: string; amount: string; currencyCode: string }> {
  await new Promise((resolve) =>
    setTimeout(resolve, 120 + Math.random() * 180),
  );
  return {
    refundId: `re_${chargeId.slice(3)}`,
    amount,
    currencyCode,
  };
}
