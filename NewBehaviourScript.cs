
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;




public class Player
{
  

    public int id;
    public string name;
    public int team;
    
}


 public class NewBehaviourScript : MonoBehaviour
  
{

    List<Player> players = new List<Player>();

    void Start()
    {
        StartCoroutine(GetText());
    }

    IEnumerator GetText()
    {
        UnityWebRequest www = UnityWebRequest.Get("http://localhost:5000/darts/playersTeam");
        yield return www.SendWebRequest();

        if (www.isNetworkError || www.isHttpError)
        {
            Debug.Log(www.error);
        }
        else
        {
            // Show results as text
            Debug.Log(www.downloadHandler.text);
            string[] sections1 = www.downloadHandler.text.Split(';');
            

            foreach (string playerText in sections1)
            {
                if (playerText.Length > 1)
                {
                    Player player = new Player();
                    string[] sections2 = playerText.Split(',');


                    player.id = Convert.ToInt32( sections2[0]);
                    player.name = sections2[1];
                    player.team = Convert.ToInt32(sections2[2]);

                    players.Add(player);
                    Debug.Log(player.id+" "+ player.name + " " + player.team);
                }
            }

            

        }
    }
}
