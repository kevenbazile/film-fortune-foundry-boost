
// PayPal global object types
interface Window {
  paypal?: {
    HostedButtons: (options: { hostedButtonId: string }) => {
      render: (selector: string) => Promise<void>;
    };
  };
}
