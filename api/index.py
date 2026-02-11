import os
import sys

# Add project root to sys.path so 'src' module can be found
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.backend.main import app
