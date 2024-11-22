"use client";

import Navbar from "@/app/components/Navbar";
import { apiURL } from "@/app/scripts/api";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import "../styles/profile.scss";
import { Content } from "@/app/content/models/Content";
import { User } from "../models/User";
import { useRouter } from "next/navigation";

interface ViewProfileProps {
  id: string;
}

export default function ViewProfile({ id }: ViewProfileProps) {
  // ---------------------------------------
  // -------------- Variables --------------
  // ---------------------------------------
  const [user, setUser] = useState<User | null>(null);
  const [contents, setContents] = useState<Content[]>([]);

  const router = useRouter();

  // ---------------------------------------
  // ------------ Event Handler ------------
  // ---------------------------------------

  // Fetch user data on page load
  const hasFetchedData = useRef(false);
  useEffect(() => {
    if (!hasFetchedData.current) {
      getUserInfo(id);
      hasFetchedData.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------
  // -------------- Functions --------------
  // ---------------------------------------
  function getUserInfo(userId: string = id) {
    axios.get(`${apiURL}/user/${userId}`).then((res) => {
      setUser(res.data);

      if (res.data?.content) {
        for (let i = 0; i < res.data.content.length; i++) {
          getContent(res.data.content[i]);
        }
      }
    });
  }

  function getContent(contentId: string) {
    axios.get(`${apiURL}/content/${contentId}`).then((res) => {
      const fetchedContent = res.data;

      // Convert Firestore Timestamp to JavaScript Date
      if (fetchedContent.dateCreated && fetchedContent.dateCreated.seconds) {
        fetchedContent.dateCreated = new Date(
          fetchedContent.dateCreated.seconds * 1000
        );
      } else {
        fetchedContent.dateCreated = new Date(fetchedContent.dateCreated);
      }

      fetchedContent.id = contentId;
      setContents((prevContents) => [...prevContents, fetchedContent]);
    });
  }

  // --------------------------------------
  // -------------- Render ----------------
  // --------------------------------------
  return (
    <>
      <Navbar />
      <div className='main-content'>
        <div className='profile-banner'>
          <div className='profile-banner-image'>
            {user && user.profileImage && (
              <Image
                src={user.profileImage}
                width={200}
                height={200}
                alt='Profile Picture'
                className='profile-banner-image'
              />
            )}{" "}
          </div>

          <div className='profile-banner-info'>
            <h1>{user?.username}</h1>
            <p>
              {user?.firstName} {user?.lastName}
            </p>
            <p>{user?.bio}</p>
          </div>
        </div>

        <h2 className='section-title'>
          {" "}
          {contents.length === 1 ? "Content" : "Contents"}{" "}
        </h2>
        {contents.length === 0 ? (
          <h2>No content found</h2>
        ) : (
          <div className='content-list'>
            {contents.map((content, index) => (
              <div
                key={content.id || index}
                className='content-list-item'
                onClick={() => router.push(`/content/${content.id}`)}
              >
                <h3 className='content-item-title'>{content.title}</h3>
                <p>
                  {new Date(content.dateCreated).toLocaleString("en-US", {
                    month: "short",
                  })}{" "}
                  {new Date(content.dateCreated).getDate()}
                  {content.readtime ? ` - ${content.readtime} min read` : ""}
                </p>
                {/* Load thumbnail image from URL */}

                {content.thumbnail && (
                  <div className='content-thumbnail-container'>
                    <Image
                      src={content.thumbnail}
                      alt='Thumbnail'
                      width={200}
                      height={200}
                      className='content-thumbnail'
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
