import { useState } from "react";
import toast from "react-hot-toast";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const QR1 = "/merchandise/merch-qr-27-02.jpg";
const QR2 = "/merchandise/regularQR.jpeg";

function OrderForm({ setShowOrderForm, size, color }) {
  const [loading, setLoading] = useState(false); // change to true if loading image dynamically
  const [qrLink, setQrLink] = useState(QR1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Extract form data
    const formData = new FormData(e.target);
    const fullname = formData.get("name");
    // const email = formData.get("email");
    const nameOnShirt = formData.get("nameonshirt");
    const paymentProof = formData.get("paymentProof");
    const college = formData.get("college");
    const department = formData.get("department");
    const year = formData.get("year");
    const contact = formData.get("contact");
    const campus = formData.get("campus");

    // toast([color, size]);
    // Validate the input
    if (!nameOnShirt.trim()) {
      toast("Please enter a name for the shirt.");
      setIsSubmitting(false);
      return;
    }
    if (!paymentProof || paymentProof.size === 0) {
      toast("Please upload a payment proof image.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate uploading the file (Replace with actual API call)
      // console.log(nameOnShirt, paymentProof);
      const uploadFormData = new FormData();
      uploadFormData.append("image", paymentProof);
      uploadFormData.append("fullname", fullname);
      // uploadFormData.append("email", email);
      uploadFormData.append("nameOnShirt", nameOnShirt);
      uploadFormData.append("college", college);
      uploadFormData.append("department", department);
      uploadFormData.append("year", year);
      uploadFormData.append("size", size);
      uploadFormData.append("color", color);
      uploadFormData.append("contact", contact);
      uploadFormData.append("campus", campus);

      // Send the image to your backend API
      const response = await fetch(`${backendUrl}/api/v1/merch/submitImage`, {
        method: "POST",
        body: uploadFormData,
        credentials: "include",
      });

      // const responseBody = { size, color };

      // const updateUserMerch = await fetch(
      //   `${backendUrl}/api/v1/users/merchandise`,
      //   {
      //     method: "POST",
      //     body: JSON.stringify(responseBody),
      //     credentials: "include",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   },
      // );

      if (response.ok) {
        toast("Order submitted successfully!");
        setShowOrderForm(false); // Close the form after submission
      } else {
        toast("Failed to upload payment proof.");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      toast("An error occurred while submitting your order.");
    }finally{
      setIsSubmitting(false);
    }
  };
  const handleCloseForm = () => {
    setShowOrderForm(false);
  };
  return (
    <>
      <div className="fixed inset-0 bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
        <div className="border border-gray-500 bg-background rounded-md w-full max-w-md mx-4 max-h-[80vh] mt-16 flex flex-col">
          <div className="p-6 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-center">
              Complete Your Order
            </h2>

            <form onSubmit={handleSubmitOrder}>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="name"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full p-2 bg-[#1c1c1c] border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-white"
                  required
                />
              </div>

              {/* <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-2 bg-[#1c1c1c] border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-white"
                  required
                />
              </div> */}

              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="nameonshirt"
                >
                  Name on Shirt(Max 10 Chars)
                </label>
                <input
                  type="text"
                  id="nameonshirt"
                  name="nameonshirt"
                  className="w-full p-2 bg-[#1c1c1c] border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-white"
                  maxLength={10}
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="nameonshirt"
                >
                  College
                </label>
                <input
                  type="text"
                  id="college"
                  name="college"
                  className="w-full p-2 bg-[#1c1c1c] border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-white"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="year"
                >
                  Year
                </label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  className="w-full p-2 bg-[#1c1c1c] border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-white"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="department"
                >
                  Department
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  className="w-full p-2 bg-[#1c1c1c] border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="department"
                >
                  Contact No
                </label>
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  className="w-full p-2 bg-[#1c1c1c] border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-white"
                  required
                  minLength={10}
                  maxLength={10}
                  pattern="[0-9]{10}"
                  inputMode="numeric"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="campus"
                >
                  Which campus?
                </label>
                <select
                  id="campus"
                  name="campus"
                  className="w-full p-2 bg-[#1c1c1c] border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-white"
                  required
                >
                  <option value="">Select a campus</option>
                  <option value="jadavpur">Jadavpur</option>
                  <option value="saltlake">Salt Lake</option>
                </select>
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="name"
                >
                  Size
                </label>
                <input
                  type="text"
                  id="size"
                  name="size"
                  value={size}
                  className="w-full p-2 bg-[#1c1c1c] border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-white"
                  disabled
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="name"
                >
                  Colour
                </label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  className="w-full p-2 bg-[#1c1c1c] border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-white"
                  disabled
                  value={color}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="qr">
                  QR code
                </label>

                {loading ? (
                  "loading"
                ) : (
                  <img
                    src={qrLink}
                    className="block w-full text-sm text-gray-100
      file:mr-4 file:py-2 file:px-4
      file:rounded-lg file:border-0
      file:text-sm file:font-semibold
      file:bg-green-100 file:text-white
      hover:file:bg-green-200"
                  />
                )}
              </div>
              <div className="flex flex-col justify-around gap-y-1 text-sm mb-2">
                <p>Having issues with payment?</p>
                <button
                  className="w-fit bg-green-500 hover:bg-green-600 px-4 py-2 rounded-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setQrLink(prev => prev === QR1 ? QR2 : QR1)
                  }
                  }
                >Get Alternate QR
                </button>
              </div>
              <div className="mb-6">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="paymentProof"
                >
                  Payment Proof
                </label>
                <p className="text-xs mb-2">
                  (The file size should be less than 2MB.)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  id="paymentProof"
                  name="paymentProof"
                  className="block w-full text-sm text-gray-400 
    file:mr-4 file:py-2 file:px-4 
    file:rounded-lg file:border-0 
    file:text-sm file:font-semibold 
    file:bg-green-500 file:text-white 
    hover:file:bg-green-600"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-500 rounded hover:bg-gray-700"
                  onClick={handleCloseForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1c1c1c] border border-gray-500 rounded hover:bg-gray-700"
                  disabled={isSubmitting}
                >
                {isSubmitting ? 'Submitting...' : 'Submit Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
export default OrderForm;
