from flask import Flask
from app.models import db

def create_app():
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object('app.config.Config')
    
    # Register blueprints
    from app.routes import api as main_blueprint
    app.register_blueprint(main_blueprint)
    

    return app


app = create_app()