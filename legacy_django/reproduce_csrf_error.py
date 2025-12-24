import requests
from bs4 import BeautifulSoup

# URL of the local server
BASE_URL = 'http://localhost:8000'
LOGIN_URL = f'{BASE_URL}/accounts/login/'
LOGOUT_URL = f'{BASE_URL}/accounts/logout/'
DASHBOARD_URL = f'{BASE_URL}/dashboard/'

# Create a session to persist cookies
session = requests.Session()

def get_csrf_token(url):
    response = session.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    csrf_token = soup.find('input', {'name': 'csrfmiddlewaretoken'})
    if csrf_token:
        return csrf_token['value']
    return None

def login(username, password):
    print(f"Attempting to login as {username}...")
    csrf_token = get_csrf_token(LOGIN_URL)
    if not csrf_token:
        print("Failed to retrieve CSRF token for login.")
        return False

    login_data = {
        'username': username,
        'password': password,
        'csrfmiddlewaretoken': csrf_token,
        'next': '/dashboard/'
    }
    
    headers = {
        'Referer': LOGIN_URL
    }

    response = session.post(LOGIN_URL, data=login_data, headers=headers)
    
    if response.status_code == 200 and "dashboard" in response.url:
        print("Login successful.")
        return True
    elif response.status_code == 200:
        # Check if we are still on login page (failed login)
        if "login" in response.url:
             print("Login failed (invalid credentials).")
        else:
             print(f"Login returned 200 but unexpected URL: {response.url}")
        return False
    else:
        print(f"Login failed with status code: {response.status_code}")
        return False

def logout():
    print("Attempting to logout...")
    # We need to get the CSRF token from the page where the logout button is (e.g., dashboard)
    # The logout form is in the navbar, so it should be on the dashboard page.
    response = session.get(DASHBOARD_URL)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Find the logout form
    logout_form = soup.find('form', {'action': '/accounts/logout/'})
    if not logout_form:
        print("Could not find logout form on dashboard.")
        return False
        
    csrf_input = logout_form.find('input', {'name': 'csrfmiddlewaretoken'})
    if not csrf_input:
        print("Could not find CSRF token in logout form.")
        return False
        
    csrf_token = csrf_input['value']
    
    logout_data = {
        'csrfmiddlewaretoken': csrf_token
    }
    
    headers = {
        'Referer': DASHBOARD_URL
    }
    
    response = session.post(LOGOUT_URL, data=logout_data, headers=headers)
    
    if response.status_code == 200 or response.status_code == 302:
        print("Logout successful (or redirected).")
        print(f"Final URL: {response.url}")
        return True
    elif response.status_code == 403:
        print("Logout failed: 403 Forbidden (CSRF error likely).")
        return False
    else:
        print(f"Logout failed with status code: {response.status_code}")
        return False

if __name__ == "__main__":
    # Test 1: Standard Login -> Logout
    print("\n--- Test 1: Standard Login -> Logout ---")
    if login('manager', 'password123'):
        logout()
    
    # Test 2: Login -> Dashboard -> Login again (without logout)
    print("\n--- Test 2: Login -> Dashboard -> Login again ---")
    session = requests.Session() # Reset session
    if login('manager', 'password123'):
        # Access dashboard
        session.get(DASHBOARD_URL)
        # Try to login again while authenticated
        # We need to get a fresh token from the login page first?
        # If we just POST to login, we need a token.
        # Let's fetch the login page to get a token.
        csrf_token = get_csrf_token(LOGIN_URL)
        if csrf_token:
            login_data = {
                'username': 'manager',
                'password': 'password123',
                'csrfmiddlewaretoken': csrf_token,
                'next': '/dashboard/'
            }
            headers = {'Referer': LOGIN_URL}
            response = session.post(LOGIN_URL, data=login_data, headers=headers)
            print(f"Re-login status: {response.status_code}")
            if response.status_code == 403:
                print("Re-login failed with 403 Forbidden")
        else:
            print("Could not get CSRF token for re-login")

    # Test 3: Mixed domains (simulated)
    # This is hard to simulate with requests session as it handles cookies automatically for the domain.
    # But we can try to manually set a bad token.
    print("\n--- Test 3: Bad Token ---")
    session = requests.Session()
    response = session.get(LOGIN_URL)
    # Extract cookie
    # Post with wrong token
    login_data = {
        'username': 'manager',
        'password': 'password123',
        'csrfmiddlewaretoken': 'wrong_token',
        'next': '/dashboard/'
    }
    headers = {'Referer': LOGIN_URL}
    response = session.post(LOGIN_URL, data=login_data, headers=headers)
    print(f"Bad token login status: {response.status_code}")

