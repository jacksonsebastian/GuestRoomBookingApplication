import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import React from "react";

interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
  phone: string;
}

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .required("Email is required")
    .email("Email must be a valid email address"),
  password: Yup.string().required("Password is required"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
});

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormInputs>({
    resolver: yupResolver(RegisterSchema),
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: RegisterFormInputs) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "http://your-api-endpoint/register",
        data
      );
      console.log("Registration successful:", response.data);
      // Handle successful registration, e.g., redirect to login page
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("Registration failed. Please try again.");
      reset();
    } finally {
      reset();
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Register</h3>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    {...register("name")}
                    type="text"
                    id="name"
                    className={`form-control ${
                      errors.name ? "is-invalid" : ""
                    }`}
                  />
                  {errors.name && (
                    <div className="invalid-feedback">
                      {errors.name.message}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    {...register("email")}
                    type="text"
                    id="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">
                      {errors.email.message}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    {...register("password")}
                    type="password"
                    id="password"
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">
                      {errors.password.message}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <input
                    {...register("phone")}
                    type="text"
                    id="phone"
                    className={`form-control ${
                      errors.phone ? "is-invalid" : ""
                    }`}
                  />
                  {errors.phone && (
                    <div className="invalid-feedback">
                      {errors.phone.message}
                    </div>
                  )}
                </div>
                {errorMessage && (
                  <div className="alert alert-danger">{errorMessage}</div>
                )}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Registering..." : "Register"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
