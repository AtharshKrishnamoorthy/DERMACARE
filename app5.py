import streamlit as st
from streamlit_option_menu import option_menu
import requests
from datetime import datetime
from PIL import Image
import tempfile
from report import analyze_medical_report
from identification_model import Model
from llm_response import get_llm_response

# Function to maintain session state for username_signup
@st.experimental_singleton
def get_username_signup():
    if 'username_signup' not in st.session_state:
        st.session_state.username_signup = None
    return st.session_state.username_signup

# User Authentication Page
def user_authentication():
    col1, col2 = st.columns([2, 3])

    with col1:
        st.markdown("<h3>New Here?</h3>", unsafe_allow_html=True)
        st.markdown("<p>Sign up and discover a wide range of skin diagnosis features.</p>", unsafe_allow_html=True)
        if st.button("Sign Up",on_click=user_signup):
           st.switch_page(user_signup)

    with col2:
        st.markdown("<h3>Login to Your Account</h3>", unsafe_allow_html=True)
        
        username_login = st.text_input("Username (Sign In)")
        password_login = st.text_input("Password (Sign In)", type="password")

        if st.button("Sign In"):
            login_data = {
                "username": username_login,
                "password": password_login
            }

            response = requests.post("http://127.0.0.1:8000/signin/", data=login_data)
            if response.status_code == 200:
                user_data = response.json()
                st.success("Signed in successfully!")
                st.success("Redirecting to Home Page...")
                st.session_state.username_signup = username_login
                st.session_state.page = "home_page"
                st.experimental_rerun()
            else:
                st.error("Sign in failed. Please check your credentials.")

def user_signup():
    col1, col2, col3 = st.columns([1, 2, 1])
    
    with col2:
        st.markdown("<h3>Create a New Account</h3>", unsafe_allow_html=True)
        username_signup = st.text_input("Username (Sign Up)")
        password_signup = st.text_input("Password (Sign Up)", type="password")
        email_signup = st.text_input("Email (Sign Up)")
        phone_signup = st.text_input("Phone Number (Sign Up)")

        if st.button("Sign Up"):
            signup_data = {
                "name": username_signup,
                "password": password_signup,
                "email": email_signup,
                "phone_number": phone_signup,
            }
            response = requests.post("http://127.0.0.1:8000/signup/", json=signup_data)
            if response.status_code == 200:
                st.success("Signed up successfully!")
                st.success("Now login with your credentials")
                st.session_state.page = "user_authentication"
                st.experimental_rerun()
            else:
                st.error("Sign up failed. Please try again.")

def home_page():
    with st.sidebar:
        selected = option_menu("Main Menu", ["Home Page", "Disease Identification", "Report Review", "ChatBot Support", 'Settings'], 
                               icons=['house', "virus", 'file-earmark-medical', 'chat-dots', 'gear'], menu_icon="cast")
        if selected == "Home Page":
            st.session_state.page = "home_page"
            st.experimental_rerun()
        elif selected == "Disease Identification":
            st.session_state.page = "disease_classification"
            st.experimental_rerun()
        elif selected == "Report Review":
            st.session_state.page = "report_review"
            st.experimental_rerun()
        elif selected == "ChatBot Support":
            st.session_state.page = "chatbot"
            st.experimental_rerun()
    
    current_time = datetime.now().time()
    if current_time < datetime.strptime('12:00:00', '%H:%M:%S').time():
        greeting = "Good morning"
    elif current_time < datetime.strptime('18:00:00', '%H:%M:%S').time():
        greeting = "Good afternoon"
    else:
        greeting = "Good evening"
    
    username_signup = get_username_signup()
    
    if username_signup is not None:
        st.markdown(f"<h3 style='text-align:center;'>{greeting}, {username_signup}!</h3>", unsafe_allow_html=True)
    else:
        st.markdown(f"<h3 style='text-align:center;'>{greeting}!</h3>", unsafe_allow_html=True)
    
    st.markdown("<h3 style='text-align:center;'>Welcome to Dermacare</h3>", unsafe_allow_html=True)
    st.markdown("""
        <div style="display: flex; justify-content: center;">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGmJ-EpZb2wELiP44_VgIb7_SFd8spUF2tv_GNCWaPjuTeOEq9saiMMuL4Qiik7fTFBWc&usqp=CAU" alt="Logo" width="150" style="border-radius: 20px;">
        </div>
        """, unsafe_allow_html=True)
    st.markdown("<h4 style='text-align:center;'>How can we assist you today?</h4>", unsafe_allow_html=True)
    
    # Functionalities dropdown menu
    selected_option = st.selectbox("Select a functionality:", ["Disease Identification", "Chatbot Support", "Medical Report Analysis"], 
                                   index=None, placeholder="Choose an option here")

    if selected_option == "Disease Identification":
        st.info("You selected Disease Identification. Redirecting to the page...")
        st.session_state.page = "disease_classification"
        st.experimental_rerun()
    elif selected_option == "Chatbot Support":
        st.info("You selected Chatbot Support. Redirecting to the page...")
        st.session_state.page = "chatbot"
        st.experimental_rerun()
    elif selected_option == "Medical Report Analysis":
        st.info("You selected Medical Report Analysis. Redirecting to the page...")
        st.session_state.page = "report_review"
        st.experimental_rerun()
        
def disease_classification():
    with st.sidebar:
        selected = option_menu("Main Menu", ["Home Page", "Disease Identification", "Report Review", "ChatBot Support", 'Settings'], 
                               icons=['house', "virus", 'file-earmark-medical', 'chat-dots', 'gear'], menu_icon="cast")
        if selected == "Home Page":
            st.session_state.page = "home_page"
            st.experimental_rerun()
        elif selected == "Disease Identification":
            st.session_state.page = "disease_classification"
            st.experimental_rerun()
        elif selected == "Report Review":
            st.session_state.page = "report_review"
            st.experimental_rerun()
        elif selected == "ChatBot Support":
            st.session_state.page = "chatbot"
            st.experimental_rerun()
    
    st.markdown("<h1 style='text-align:center;'>Skin Disease Identification</h1>", unsafe_allow_html=True)
    file = st.file_uploader("Please upload your disease image", type=["jpg", "png", "jpeg"])
    submit1 = st.button("Proceed", key="For submit 1")
    if file is not None:
        image = Image.open(file)
        model = Model(image)
        prediction = model.predict_class()
        st.success(f"The predicted skin disease is: {prediction}")
        if submit1:  # Process user input if "Proceed" button is clicked
            response = get_llm_response(prediction)
            st.write(response)

def chatbot():
    with st.sidebar:
        selected = option_menu("Main Menu", ["Home Page", "Disease Identification", "Report Review", "ChatBot Support", 'Settings'], 
                               icons=['house', "virus", 'file-earmark-medical', 'chat-dots', 'gear'], menu_icon="cast")
        if selected == "Home Page":
            st.session_state.page = "home_page"
            st.experimental_rerun()
        elif selected == "Disease Identification":
            st.session_state.page = "disease_classification"
            st.experimental_rerun()
        elif selected == "Report Review":
            st.session_state.page = "report_review"
            st.experimental_rerun()
        elif selected == "ChatBot Support":
            st.session_state.page = "chatbot"
            st.experimental_rerun()
    
    st.markdown("<h3 style='text-align:center;'>Want to query about the skin disease?</h3>", unsafe_allow_html=True)
    st.write("")
    st.markdown("<h5 style='text-align:left;'>Discuss with our Chatbot:</h5>", unsafe_allow_html=True)

    messages = st.container()
    if prompt := st.chat_input("Say something"):
        messages.chat_message("user").write(prompt)
        response = get_llm_response(prompt)
        messages.chat_message("assistant").write(f"Assistant: {response}")

def report_review():
    with st.sidebar:
        selected = option_menu("Main Menu", ["Home Page", "Disease Identification", "Report Review", "ChatBot Support", 'Settings'], 
                               icons=['house', "virus", 'file-earmark-medical', 'chat-dots', 'gear'], menu_icon="cast")
        if selected == "Home Page":
            st.session_state.page = "home_page"
            st.experimental_rerun()
        elif selected == "Disease Identification":
            st.session_state.page = "disease_classification"
            st.experimental_rerun()
        elif selected == "Report Review":
            st.session_state.page = "report_review"
            st.experimental_rerun()
        elif selected == "ChatBot Support":
            st.session_state.page = "chatbot"
            st.experimental_rerun()
    
    st.markdown("<h1 style='text-align:center;'>Report Analysis</h1>", unsafe_allow_html=True)

    # File uploader
    uploaded_files = st.file_uploader("Upload medical report images (JPG, JPEG, PNG)", type=["jpg", "jpeg", "png"], accept_multiple_files=True)

    if uploaded_files:
        # Display uploaded images and analysis result automatically
        for uploaded_file in uploaded_files:
            col1, col_spacer, col3 = st.columns([1, 0.5, 3])
            with col1:
                st.image(uploaded_file, caption="Uploaded medical report image", use_column_width=True)

            # Convert uploaded file to PIL image
            pil_image = Image.open(uploaded_file)

            # Convert PIL image to bytes
            with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_image:
                pil_image.save(temp_image.name)

            # Convert bytes to URL
            image_url = temp_image.name

            # Analyze medical report
            responses = analyze_medical_report(image_url)

            # Display analysis result on the right side
            with col3:
                st.subheader("Analysis Result:")
                st.markdown(responses)

def main():
    # Initialize the 'page' in session state if it's not already set
    if "page" not in st.session_state:
        st.session_state.page = "user_authentication"

    # Switch between pages based on the session state 'page'
    if st.session_state.page == "user_authentication":
        user_authentication()
    elif st.session_state.page == "user_signup":
        user_signup()
    elif st.session_state.page == "home_page":
        home_page()
    elif st.session_state.page == "disease_classification":
        disease_classification()
    elif st.session_state.page == "chatbot":
        chatbot()
    elif st.session_state.page == "report_review":
        report_review()

if __name__ == "__main__":
    main()
