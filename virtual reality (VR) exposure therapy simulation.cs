using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class VRPlayerController : MonoBehaviour
{
    public float speed = 3.0f;
    private CharacterController characterController;
    private Transform vrHead;

    void Start()
    {
        characterController = GetComponent<CharacterController>();
        vrHead = Camera.main.transform;
    }

    void Update()
    {
        // Get the forward direction based on the VR headset's orientation
        Vector3 forward = vrHead.TransformDirection(Vector3.forward);
        // Set Y component to 0 to prevent flying
        forward.y = 0.0f;
        // Normalize to maintain speed consistency regardless of headset orientation
        forward.Normalize();

        // Get the right direction based on the VR headset's orientation
        Vector3 right = vrHead.TransformDirection(Vector3.right);

        // Calculate movement direction based on input
        float moveHorizontal = Input.GetAxis("Horizontal");
        float moveVertical = Input.GetAxis("Vertical");
        Vector3 movement = (forward * moveVertical) + (right * moveHorizontal);

        // Move the player
        characterController.SimpleMove(movement * speed);
    }
}
