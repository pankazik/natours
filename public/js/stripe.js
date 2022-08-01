import axios from 'axios';
const stripe = Stripe(
  'pk_test_51LQcJxL5qFqdnk7Ew1qKyEYWvGGYp2XMIsDt1YoGgajjHlilHfUbTG7FhjkbZZrFAtQShGodjqPD0vnGQZB7nssD00PfUckDvZ'
);

export const bookTour = async (tourId) => {
  try {
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
  }
};
