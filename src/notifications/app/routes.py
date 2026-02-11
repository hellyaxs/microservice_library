from flask import Blueprint, jsonify, request

api = Blueprint('app', __name__)

@api.route('/api/person', methods=['GET'])
def get_person():
    
    return jsonify({"message": "Get person data"}), 200

@api.route('/api/person', methods=['POST'])
def create_person():
    data = request.get_json()
    return jsonify({"message": "Person created", "data": data}), 201

@api.route('/api/person/<int:person_id>', methods=['GET'])
def get_person_by_id(person_id):
    return jsonify({"message": f"Get person data for ID {person_id}"}), 200

@api.route('/api/person/<int:person_id>', methods=['PUT'])
def update_person(person_id):
    data = request.get_json()
    return jsonify({"message": f"Person with ID {person_id} updated", "data": data}), 200

@api.route('/api/person/<int:person_id>', methods=['DELETE'])
def delete_person(person_id):
    return jsonify({"message": f"Person with ID {person_id} deleted"}), 204
